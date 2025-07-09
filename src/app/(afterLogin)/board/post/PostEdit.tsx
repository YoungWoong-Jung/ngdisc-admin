'use client'

import Button from "@/component/button/Button"
import LnbHeader from "@/component/lnb/LnbHeader"
import Table, { TableCol, useTableData } from "@/component/table/Table"
import { board, post } from "@/types/Board"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import Random from "@/util/random"
import toast from "@/util/toast"
import { BodyScrollEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useEffect, useRef, useState } from "react"
import useSWR, { SWRResponse } from "swr"
import useSWRInfinite from "swr/infinite"

export default function PostEdit(){

    const getKey = (pageIndex: number, previousData: post[]) => {
        if(previousData && !previousData.length) return null
        return `/admin-api/board/posts?board_id=${selectedBoard?.board_id || ''}&page=${pageIndex + 1}`
    }
    const take = 50;

    const [selectedBoard, setSelectedBoard] = useState<board | null>(null)

    const {data:boards, mutate: mutateBoards}: SWRResponse<board[]> = useSWR('/admin-api/board/boards', Fetcher);
    // const {data: posts, mutate:mutatePosts}: SWRResponse<post[]> = useSWR(`/admin-api/board/posts?board_id=${selectedBoard?.board_id || ''}`, Fetcher);
    const {data: postsInfinite, size, setSize, mutate: mutatePosts} = useSWRInfinite<post[]>(getKey, Fetcher)

    const boardsTableRef = useRef<AgGridReact<board>>(null);
    const postsTableRef = useRef<AgGridReact<post>>(null);

    const [posts, setPosts] = useState<post[]>([])

    const [boardsTableData, setBoardsTableData] = useTableData<board>(boards || [], 'board_id')
    const [postsTableData, setPostsTableData] = useTableData<post>(posts || [], 'post_id');

    useEffect(() => {
        if(postsInfinite){
            setPosts(postsInfinite.flat())
        }
    }, [postsInfinite])

    const boardsTableColDef: TableCol[] = [
        {headerName: 'id', field: 'board_id', type: 'id', editable: false},
        {headerName: '게시판 이름', field: 'board_name', type: 'text', editable: false},
        {headerName: '게시판 설명', field: 'board_desc', type: 'longText', editable: false, flex: 1},
        {headerName: '사용여부', field: 'board_useyn', type: 'boolean', editable: false},
    ]

    const postsTableColDef: TableCol[] = [
        {headerName: 'id', field: 'post_id', type: 'id', editable: false},
        {headerName: '게시판', field: 'board_id', type: 'text', editable: true, cellEditorParams: {options: boards?.map(board => ({value: board.board_id, label: board.board_name}) )}, cellRenderer: (params: any) => {
            const board = boards?.find(board => board.board_id === params.value)
            return board?.board_name
        }},
        {headerName: '제목', field: 'title', type: 'text', editable: true},
        {headerName: '내용', field: 'content', type: 'post', editable: true},
        {headerName: '작성자', field: 'writer', type: 'text', editable: true},
        {headerName: '썸네일', field: 'thumbnail', type: 'image', editable: true},
        {headerName: '표시여부', field: 'post_useyn', type: 'boolean', editable: true},
        {headerName: '작성일', field: 'add_date', type: 'date', editable: false},
        {headerName: '수정일', field: 'update_date', type: 'date', editable: false},
    ]


    const handleBoardCellClick = (params: any) => {
        setSelectedBoard(params.data)
        mutatePosts()
    }

    const addPost = () => {
        if(!selectedBoard){
            toast('게시판을 선택해주세요')
            return
        }
        const newId = - Random.number(0,99999);
        const newPost = {
            board_id: selectedBoard.board_id,
            post_id: newId,
            title: '',
            // content: '',
            writer: '관리자',
            post_useyn: true,
            _id: newId,
            _status: 'create'
        } as unknown as post;

        setPostsTableData(prev => [...prev, newPost] as any)
    }

    const savePostUpdates = async () => {
        if(!selectedBoard){
            toast('게시판을 선택해주세요')
            return
        }
        // 유효성 검사
        for(const d of postsTableData){
            if(!d.title || !d.writer ||  !d.content || !d.board_id ){
                toast('내용을 모두 입력해주세요')
                return
            }
        }

        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        postsTableData.forEach(d => {
            if(d._status === 'create'){
                createRows.push(d)
            } else if(d._status === 'update'){
                updateRows.push(d)
            } else if(d._status === 'delete'){
                deleteRows.push(d)
            }
        })

        const result = await API.POST('/admin-api/board/changePosts', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutatePosts()
        }
    }

    const handlePostScroll = (params: BodyScrollEvent) => {
        const i = params.api.getLastDisplayedRowIndex()
        if(i === postsTableData.length - 1){
            if(postsInfinite && postsInfinite[postsInfinite?.length -1]?.length === take){
                setSize(size + 1)
            }
        }
        
    }

    return <>
        <div className="w-full h-full p-4 grid grid-rows-[auto_1fr_4fr] gap-3">
            <LnbHeader title="게시글"/>
            <Table
                label="게시판"
                keyColumn="board_id"
                colDefs={boardsTableColDef}
                data={boardsTableData}
                originalData={boards || []}
                setData={setBoardsTableData}
                ref={boardsTableRef}
                rowSelection={{mode: 'singleRow'}}
                onCellClicked={handleBoardCellClick}
            ></Table>
            <Table
                label={`게시글 ${selectedBoard?.board_name ? `(${selectedBoard.board_name})` : ''}`}
                keyColumn="post_id"
                colDefs={postsTableColDef}
                data={postsTableData}
                originalData={posts || []}
                setData={setPostsTableData}
                ref={postsTableRef}
                onScroll={handlePostScroll}
            >
                <Button onClick={addPost} className="bg-blueTone-100 text-blueTone">추가</Button>
                <Button onClick={savePostUpdates}>저장</Button>
            </Table>
        </div>
    </>
}