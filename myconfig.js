//-----------------------------
var ckbasic = [{items:['Source','Bold','Italic','Underline','Strike','Subscript','Superscript', 
                    'ckeditor_wiris_formulaEditor','ckeditor_wiris_formulaEditorChemistry', 'Mathjax']}];
var ckfull = [
    { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print', '-', 'Templates' ] },
    { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
    { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
    { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
    '/',
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
    { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
    { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
    '/',
    { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
    { name: 'wiris', items : [ 'ckeditor_wiris_formulaEditor','ckeditor_wiris_formulaEditorChemistry', 'Mathjax']}
];
var tb=ckbasic;
var ckconfig = {startupMode:'source'};
CKEDITOR.plugins.addExternal('ckeditor_wiris', 'https://www.wiris.net/demo/plugins/ckeditor/', 'plugin.js');

//CKEDITOR.plugins.addExternal('base64image', 'plugins/base64image-master/', 'plugin.js');

CKEDITOR.config.allowedContent = true;
CKEDITOR.disableAutoInline = true;

CKEDITOR.config.extraPlugins = 'ckeditor_wiris,mathjax';

CKEDITOR.config.mathJaxLib='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML';
MathJax.Hub.Config({    tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']], processEscapes: true    }  });

var role='student', inst=0, student=1, priv={}, debug=0, admin=0, group='default', uhome='/users', permission='------rwx', groups=[], roles=[], colhome='/public', Lang='EN'; 
//-----------------------------
var name, email, emailVerified, uid, uinfo={};
var firebaseConfig = {
    apiKey: "AIzaSyD8SyHAMMVV0Gtcs871LSM0tficArYX5eg",
    authDomain: "zrenix-aae2e.firebaseapp.com",
    databaseURL: "https://zrenix-aae2e.firebaseio.com",
    projectId: "zrenix-aae2e",
    storageBucket: "zrenix-aae2e.appspot.com",
    messagingSenderId: "1095365181062",
    appId: "1:1095365181062:web:db9b34e80b0572fc",
    measurementId: "G-GR8YWKSF7F"
};
