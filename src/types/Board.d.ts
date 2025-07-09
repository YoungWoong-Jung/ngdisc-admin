export interface board {
    board_id: number;
    board_name: string;
    board_desc: string;
    board_useyn: boolean;
}

export interface post {
    board_id: number;
    post_id: number;
    title: string;
    content: string;
    writer: string;
    thumbnail: string;
    post_useyn: boolean;
    add_date: Date;
    update_date: Date;
}