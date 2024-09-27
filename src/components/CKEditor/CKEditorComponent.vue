<template>
    <div>
        <div class="main-container">
            <div class="editor-container editor-container_classic-editor" ref="editorContainerElement">
                <div class="editor-container__editor">
                    <div ref="editorElement">
                        <ckeditor v-if="isLayoutReady" v-model="editorData" :editor="editor" :config="config" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
    ClassicEditor,
    AccessibilityHelp,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    Bold,
    CKBox,
    CKBoxImageEdit,
    CloudServices,
    Code,
    CodeBlock,
    Essentials,
    GeneralHtmlSupport,
    Heading,
    HtmlComment,
    HtmlEmbed,
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
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Paragraph,
    PasteFromOffice,
    PictureEditing,
    SelectAll,
    ShowBlocks,
    SourceEditing,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Undo
} from 'ckeditor5';

import translations from 'ckeditor5/translations/vi.js';
import premiumFeaturesTranslations from 'ckeditor5-premium-features/translations/vi.js';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

const LICENSE_KEY = 'YXQvam05emZhOVFqWHJGRUhlSUM4a2IzdzNZVXdDc0RTTXpFVG1nUWZsVmNFQlNXRU9iS1ZQajhxeEdsOVE9PS1NakF5TkRFd01qTT0=';
const CKBOX_TOKEN_URL = 'https://119154.cke-cs.com/token/dev/FMAqvhbW585ZlD12cNJdlebxMqxmWrey35RI?limit=10';

const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);

const isLayoutReady = ref(false);
const config = ref(null);
const editor = ClassicEditor;
const editorData = ref(props.modelValue || '');

onMounted(() => {
    config.value = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'sourceEditing',
                'showBlocks',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                'code',
                '|',
                'link',
                'insertImage',
                'ckbox',
                'insertTable',
                'codeBlock',
                'htmlEmbed',
                '|',
                'bulletedList',
                'numberedList'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AccessibilityHelp,
            Autoformat,
            AutoImage,
            AutoLink,
            Autosave,
            Bold,
            CKBox,
            CKBoxImageEdit,
            CloudServices,
            Code,
            CodeBlock,
            Essentials,
            GeneralHtmlSupport,
            Heading,
            HtmlComment,
            HtmlEmbed,
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
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            Paragraph,
            PasteFromOffice,
            PictureEditing,
            SelectAll,
            ShowBlocks,
            SourceEditing,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            Undo
        ],
        ckbox: {
            tokenUrl: CKBOX_TOKEN_URL  // hỗ trợ tải hình ảnh :))
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        htmlSupport: {
            allow: [
                { name: /^.*$/, styles: true, attributes: true, classes: true }
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
                'resizeImage',
                '|',
                'ckboxImageEdit'
            ]
        },
        licenseKey: LICENSE_KEY,
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: { download: 'file' }
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
        placeholder: 'Thêm nội dung của bạn tại đây!',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        },
        translations: [translations, premiumFeaturesTranslations]
    };
    isLayoutReady.value = true;
});

watch(() => props.modelValue, (newValue) => {
    editorData.value = newValue;
});

watch(editorData, (newValue) => {
    emits('update:modelValue', newValue);
});
</script>
