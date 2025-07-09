'use client'

import 'ckeditor5/ckeditor5.css';
import './CustomPostCellEditor.css'
import HTMLReactParser from "html-react-parser/lib/index"
/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoRgTANARGB0BssRWgdlWAnKkAWTAzPLvAAwECs6YuIqhAHCfKheVXfClAKYB2KSKAggIpEWJEBdaCEzwGpTAGMoUoA=
 */

import { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	BalloonEditor,
	Alignment,
	Autoformat,
	AutoImage,
	Autosave,
	BalloonToolbar,
	Base64UploadAdapter,
	BlockQuote,
	Bold,
	CloudServices,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	Highlight,
	HorizontalLine,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Style,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	TodoList,
	Underline,
	ClassicEditor
} from 'ckeditor5';
import toast from '@/util/toast';
import useTimer from '@/hooks/useTimer';


export default function CustomPostCellEditor({
    value,
    onValueChange
}: {
    value: any;
    onValueChange: (value: any) => void;
}) {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: [
						'undo',
						'redo',
						// '|',
						// 'heading',
						// 'style',
						'|',
						'fontSize',
						'fontFamily',
						'fontColor',
						'fontBackgroundColor',
						'|',
						'bold',
						'italic',
						'underline',
						'strikethrough',
						'|',
						'specialCharacters',
						'horizontalLine',
						'link',
						'insertImage',
						'mediaEmbed',
						'insertTable',
						'highlight',
						'blockQuote',
						'|',
						'alignment',
						'|',
						'bulletedList',
						'numberedList',
						'todoList',
						'outdent',
						'indent'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					Alignment,
					Autoformat,
					AutoImage,
					Autosave,
					BalloonToolbar,
					Base64UploadAdapter,
					BlockQuote,
					Bold,
					CloudServices,
					Essentials,
					FontBackgroundColor,
					FontColor,
					FontFamily,
					FontSize,
					GeneralHtmlSupport,
					Heading,
					Highlight,
					HorizontalLine,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsert,
					ImageInsertViaUrl,
					ImageResize,
					ImageStyle,
					ImageTextAlternative,
					ImageToolbar,
					ImageUpload,
					Indent,
					IndentBlock,
					Italic,
					Link,
					LinkImage,
					List,
					ListProperties,
					MediaEmbed,
					Paragraph,
					PasteFromOffice,
					SpecialCharacters,
					SpecialCharactersArrows,
					SpecialCharactersCurrency,
					SpecialCharactersEssentials,
					SpecialCharactersLatin,
					SpecialCharactersMathematical,
					SpecialCharactersText,
					Strikethrough,
					Style,
					Table,
					TableCaption,
					TableCellProperties,
					TableColumnResize,
					TableProperties,
					TableToolbar,
					TextTransformation,
					TodoList,
					Underline
				],
				// balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
				fontFamily: {
					supportAllValues: true
				},
				fontSize: {
					options: [10, 12, 14, 'default', 18, 20, 22],
					supportAllValues: true
				},
				heading: {
					options: [
						{
							model: 'heading1',
							view: 'h1',
							title: 'Heading 1'
						},
						{
							model: 'heading2',
							view: 'h2',
							title: 'Heading 2'
						},
						{
							model: 'heading3',
							view: 'h3',
							title: 'Heading 3'
						},
						{
							model: 'heading4',
							view: 'h4',
							title: 'Heading 4'
						},
						{
							model: 'heading5',
							view: 'h5',
							title: 'Heading 5'
						},
						{
							model: 'heading6',
							view: 'h6',
							title: 'Heading 6'
						}
					]
				},
				htmlSupport: {
					allow: [
						{
							name: /^.*$/,
							styles: true,
							attributes: true,
							classes: true
						}
					]
				},
				image: {
					toolbar: [
						'toggleImageCaption',
						'imageTextAlternative',
						'|',
						'imageStyle:inline',
						'imageStyle:wrapText',
						'imageStyle:breakText',
						'|',
						'resizeImage'
					]
				},
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				list: {
					properties: {
						styles: true,
						startIndex: true,
						reversed: true
					}
				},
				placeholder: 'Type or paste your content here!',
				style: {
					definitions: [
						{
							name: 'Article category',
							element: 'h3',
							classes: ['category']
						},
						{
							name: 'Title',
							element: 'h2',
							classes: ['document-title']
						},
						{
							name: 'Subtitle',
							element: 'h3',
							classes: ['document-subtitle']
						},
						{
							name: 'Info box',
							element: 'p',
							classes: ['info-box']
						},
						{
							name: 'CTA Link Primary',
							element: 'a',
							classes: ['button', 'button--green']
						},
						{
							name: 'CTA Link Secondary',
							element: 'a',
							classes: ['button', 'button--black']
						},
						{
							name: 'Marker',
							element: 'span',
							classes: ['marker']
						},
						{
							name: 'Spoiler',
							element: 'span',
							classes: ['spoiler']
						}
					]
				},
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
				},

				// 줄바꿈과 공백 처리 설정
				enterMode: 'ENTER_P',
				shiftEnterMode: 'ENTER_BR',
				// 공백 보존 설정
				whitespace: 'preserve',
				// HTML 출력 시 줄바꿈 보존
				htmlOutput: {
					preserveWhitespace: true,
					preserveLineBreaks: true
				},
				// initialData:
				// 	value,
			}
		};
	}, [isLayoutReady]);

	const [content, setContent] = useState(value);

	const {start} = useTimer();

    const handleChange = (event: any, editor: any) => {
		const newContent = editor.getData();
		// 줄바꿈과 공백 보존
		const processedContent = newContent
			.replace(/<p><\/p>/g, '<br>') // 빈 p 태그를 br로 변환
			.replace(/<p>\s*<\/p>/g, '<br>'); // 공백만 있는 p 태그를 br로 변환
		
		start(() => {
			setContent(processedContent);
		}, 50)
    }
	useEffect(() => {
		onValueChange(content);
	}, [content])

	const handleReady = (editor: any) => {
		const editableElement = editor.ui.view.editable.element;
		if (editableElement) {
			editableElement.addEventListener('keydown', (e: KeyboardEvent) => {
				// Enter 눌렀을 때 ag-Grid 이벤트 전파 방지
				e.stopPropagation();
			});
		}

		// 줄바꿈과 공백 처리 설정
		editor.data.processor.skipComments = false;
		editor.data.processor.keepHtml = true;
		
		// 붙여넣기 시 줄바꿈 보존
		editor.editing.view.document.on('paste', (evt: any, data: any) => {
			if (data.dataTransfer.getData('text/html')) {
				const html = data.dataTransfer.getData('text/html');
				// 줄바꿈을 <br> 태그로 변환
				const processedHtml = html.replace(/\n/g, '<br>');
				editor.setData(processedHtml, { 
					noSnapshot: true,
					preventAutoInline: true 
				});
				evt.stop();
			}
		}, { priority: 'high' });
	}

	const [editing, setEditing] = useState(false);

	return (
		<div className='custom-post-cell-editor'>
			<div className='fixed h-screen w-[640px] top-0 right-0 p-6'>
				<div className='w-full h-full bg-white shadow-[0_0_32px_rgba(0,0,0,0.24)]'>
					<div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] w-full">
						<div className='bg-blueTone px-4 py-3 flex justify-between items-center w-full'>
							<p className='text-white text-sm'>{editing ? '편집 모드' : '미리보기'}</p>
							<button className='text-blueTone bg-white px-2 py-1 rounded-md' onClick={() => setEditing(!editing)}>{editing ? '미리보기' : '수정하기'}</button>
						</div>
						<div className='h-full overflow-y-auto'>
							{
								editing ? (
									<div className="main-container h-full min-h-full">
										<div className="editor-container editor-container_classic-editor h-full" ref={editorContainerRef}>
											<div className="editor-container__editor h-full min-h-full">
												<div ref={editorRef} className='h-full min-h-full'>
													{editorConfig && <CKEditor data={content} onReady={handleReady} onChange={(event, editor) => handleChange(event, editor)} editor={ClassicEditor} config={editorConfig as any} />}
												</div>
											</div>
										</div>
									</div>
								) : (
									<div className='p-4'>
										{HTMLReactParser(content || '') as ReactNode}
									</div>
								)
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
