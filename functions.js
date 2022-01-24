function initApp(O) {
    firebase.auth().onAuthStateChanged(function(user) {
     if (user) { 
       uinfo = user; email=user.email; 
       LoggedOutDisplay({id:'Login',photo:0},user);
       LogUserInfo('initApp');
       db.doc('/users/'+email).get().then((doc)=>{
         roles=doc.data().roles?doc.data().roles:['student'];  //admin= (roles.indexOf('instructor')>=0)?1:0;
         role=doc.data().role?doc.data().role:'student';  
         priv=doc.data().priv?doc.data().priv:{};  

        }); 
        //role = (email=='vkumar@utep.edu')?'instructor':'student'; 

     } else { 
       LoginDisplay({id:'Login'}); 
     }
    }, function(error) { console.log(error); }
    );
  };

var LastLogTime=null;
function LogUserInfo(tag) { if(!uinfo['email']) return;
  var LogEmails = ['vk.rice@gmail.com','vkumar@utep.edu','suman620276sri@gmail.com','ayushiraj2419@gmail.com','nehak61198@gmail.com','rinki094@gmail.com'];
  var email=uinfo.email; 
  if(!LogEmails.includes(email)) return;
  var now=firebase.firestore.Timestamp.now(), d=now.toDate();
  var dS=d.getUTCFullYear() +'-'+('0'+(d.getUTCMonth()+1)).slice(-2) +'-'+('0'+d.getUTCDate()).slice(-2);
  var time=firebase.firestore.Timestamp.now().toMillis();

  if(!(LastLogTime==null || time-LastLogTime>1*60*1000)) return; //every 1 min
  LastLogTime=time; var data={}; data[time]=tag;
  db.doc('/users/'+email+'/logs/'+dS).set(data,{merge:true}); 
}
function LoadJSs(O) {
  for(var i=0; i<O.length; i++) {
     $.ajax({
      url: O[i], dataType: O.dataType?O.dataType:"script", async: false,
      success: function () { console.log('loaded'+O[i]); },
      error: function () { throw new Error("Could not load " + script); }
     });
  }
}  

String.prototype.format = function() { var newStr = this, i = 0;
    while (/%s/.test(newStr)) newStr = newStr.replace("%s", arguments[i++])
    return newStr;
}
  
function ListByCol(col, oid) {  var uqid=uniqid(); 
  db.collection(col).get().then((qS) => {  var iq=0, s='';  
    qS.forEach((doc) => {  iq++; var id=col+'/'+doc.id, oid=uqid+iq;   
      s += `<br/> ${iq} ${id}  
        <button class=uqid onclick="EditRawByID('${id}','${oid}'); \$('#${oid}').toggle(); ToggleBold($(this)); ">Raw</button>
        <div style='display:none;' id=${oid}></div>`; 
    })   
    $('#'+oid).html(s);  if(debug) console.log(s);  
  }); 
}
function EditRawByID(id,oid) {  var uqid=uniqid(), inid=id;
  db.doc(id).get().then((doc) => {  var d=doc.data(), iq=0, s=debug?`${id} ${oid}`:'';  
    var data = JSON.stringify(d, null, 4); 
    s += `<textarea id=${uqid} data-dbid=${id} rows=10 style="width: 100%; max-width: 100%;" title=${uqid}>`+data+'</textarea>'; 
    s += `<button onclick="SaveByID('${uqid}');">Save</button>`; 

    $('#'+oid).html(s);    
  }); 
}
function SaveByID(id) {  var e = $('#'+id).data();  db.doc(e.dbid).set(JSON.parse($('#'+id).val()) );  }


  function TopLeft(O) { if(uinfo[uid]) ('#TopLeft').html('hh'); }
  
  function Middle(O) {}
  function Bottom(O) {}

  function cktb(flag) {
   if(flag=='basic') return [{items:['Source','Bold','Italic','Underline','Strike','Subscript','Superscript']}];
   else if(flag=='full')
    return [
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
    { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] }
   ];
   else return [{items:['Source','Bold','Italic','Underline','Strike','Subscript','Superscript']}];

  }

var setIntervalIDs={}; 
function startTimer(duration, oid) { //Timer
    if(setIntervalIDs[oid]) return;
    var timer = duration, minutes, seconds;
    setIntervalIDs[oid] = setInterval(function () {
        minutes = parseInt(timer / 60, 10); seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('#'+oid).html(minutes + ":" + seconds);
        $('#startTimer').hide(); $('#ssID').show();
        if (--timer < 0) { clearInterval(setIntervalIDs[oid]) ; }
    }, 1000);
}

function elapsedTime(duration, oid) { //Timer
    if(setIntervalIDs[oid]) return;
    var timer = 0, minutes, seconds;
    setIntervalIDs[oid]=  setInterval(function () {
        minutes = parseInt(timer / 60, 10); seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('#'+oid).html(minutes + ":" + seconds);
        if (++timer > duration) { clearInterval(setIntervalIDs[oid]); }
    }, 1000);
}
function stopInetvalIDs(IDs) { for(var i=0; i<IDs.length; i++) clearInterval(setIntervalIDs[i]); }

  function ChangeCKEditor(e) {
    var src4="https://utep.zrenix.com/~nalandi/ckeditor/ckeditor4/ckeditor/ckeditor.js";
    var src5="https://utep.zrenix.com/~nalandi/ckeditor/ckeditor5-inline/build/ckeditor.js";
    var src=(e=='ck4')?src4:src5;
    if($('#'+e).length) document.head.removeChild(document.getElementById(e));
    var cksrc= document.createElement("script"); 
    cksrc.setAttribute("src", src); cksrc.setAttribute("id", e);
    document.head.appendChild(cksrc);
  }

  function getURLVars() { 
    var vars = {}; 
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { vars[key] = value; });
    return vars;
  }
  function save(col,id,d) { db.collection(col).doc(id).set(d, {merge: true }); }
  function update(col,id,d) { db.collection(col).doc(id).update(d); }
  function get(col,id,d) {
    db.collection(col).doc(id).get().then(function(doc) {
      if (doc.exists) { $('#TA').val(doc.data().v); console.log("Document data:", doc.data());
      } else { console.log("No such document!"); }
    }).catch(function(error) { console.log("Error getting document:", error); });
  }
  
  function realtime_sync(col,id,d) {
   db.collection(col).doc(id)
      .onSnapshot(function(doc) {
          var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          if(source=='Server') $('#TA').val(doc.data().v);
      });
  }
  function uniqid(a = "", b = false) {
      const c = Date.now()/1000;
      let d = c.toString(16).split(".").join("");
      while(d.length < 14) d += "0";
      let e = ""; if(b){ e = "_"; e += Math.round(Math.random()*100000000); }
      return a + d + e;
  }
  function uniqid2(length){
    var dec2hex = [];
    for (var i=0; i<=15; i++) {
      dec2hex[i] = i.toString(16);
    }
  
    var uuid = '';
    for (var i=1; i<=36; i++) {
      if (i===9 || i===14 || i===19 || i===24) {
        uuid += '-';
      } else if (i===15) {
        uuid += 4;
      } else if (i===20) {
        uuid += dec2hex[(Math.random()*4|0 + 8)];
      } else {
        uuid += dec2hex[(Math.random()*16|0)];
      }
    }
  
    if(length) uuid = uuid.substring(0,length);
    return uuid;
  }
  function DisplayQ(Q, col,id) { $('#QD').html(s); }
  function Edit(O) {  var col='public', id='topmenu'; //db.collection(col).doc('q1').update({['Q.v']:e.val()});
    db.collection(col).doc(id).get().then(function(doc) {
      if (doc.exists) { Dis(doc.data()); } 
    });
  }
  function json2str(O) {return JSON.stringify(O, null,1);}
  function str2json(O) {return JSON.parse(O);}
  function alrt(O) {alert(json2str(O));}
  
  
  String.prototype.toHtmlEntities = function() { // Convert a string to HTML entities
      return this.replace(/./gm, function(s) { return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";"; });
  };
  String.fromHtmlEntities = function(string) { // Create string from HTML entities
      return (string+"").replace(/&#\d+;/gm,function(s) { return String.fromCharCode(s.match(/\d+/gm)[0]); })
  };
  
  function ifSet(object, path) {
    return path.split('.').reduce((obj, part) => obj && obj[part], object)
  }
  class Q {
    constructor(O) { 
      this['uqid']=uniqid();
      for(var k of Object.keys(O)) {this[k] = O[k];} 
      if(!O.hasOwnProperty('col')) this['col'] = 'public'; 
      if(!O.hasOwnProperty('id')) this['id'] = 'test1'; 
      if(!O.hasOwnProperty('db')) this['db'] = firebase.firestore(); 
      if(!O.hasOwnProperty('oid')) this['oid'] = 'QD2';
    }; 
   DisRaw(O) {  var uqid=this.uqid, col=this.col, id=this.id, oid=this.oid; 
    db.collection(col).doc(id).get().then(function(doc) { 
      if (doc.exists) { 
      var v = json2str(doc.data()); 
      var s = " \
         <input id="+ uqid +"update type=checkbox>Update</input> | \
         <input id="+ uqid +"check type=checkbox>Realtime</input> \
         <br/><textarea rows=10 data-col=" + col + " data-id=" + id + " topmenu \
            cols=50 oninput=\"  var data = $(this).data(); console.log(data); \
            var merge = ($('#"+ uqid + "update').is(':checked')) ? true : false; \
            if($('#"+ uqid + "check').is(':checked')) \
            db.collection('public').doc('topmenu').set(str2json($(this).val()), {merge: merge}); \
            $('#" + uqid + "msg').html('Updated at ' + new Date()); \
         \">"+v+"</textarea><div id="+uqid+"msg>"+uqid+"</div>";
        $('#'+oid).html(s);
    } });
   }
  }
  
  function getDataByID(id) { return (CKEDITOR.instances[id])? CKEDITOR.instances[id].getData() : $('#'+id).val(); }
  //function getDataByClass(cid) { return (CKEDITOR.instances[id])? CKEDITOR.instances[id].getData() : $('#'+id).val(); }
  function LoadButton(elID,oID) { return "<button onclick=\"  var d=$('#"+elID+"').data(); d.dtype='html'; var I=new IO3(d); I.Edit('"+oID+"');  \">Load</button>"; }
  function UpdateByID(id) { 
    var d = $('#'+id).data(); var col=d.col, doc=d.doc, key=d.key;
    var merge = ($('#'+ d.uqid + 'update').is(':checked')) ? true : false; 
    var data = (d.dtype=='json')? JSON.parse(getDataByID(id+key)) : {[key]:getDataByID(id+key)};
    db.collection(col).doc(doc).set(data, {merge: merge}); 
    $('#' + d.uqid + 'msg').html('Updated /'+col+'/'+doc+' at ' + new Date()); 
  }
  function RealtimeByID(id) {
    var d = $('#'+id).data(); var key = d.key, editorid=id+key;
    realtime = ($('#'+ d.uqid + 'realtime').is(':checked'));
    $('.'+d.uqid+'hide').attr('disabled',realtime?true:false);  
    if(CKEDITOR.instances[editorid])  { 
        if(realtime) CKEDITOR.instances[editorid].on('change', function(e) { UpdateByID(id);}) 
        else { CKEDITOR.instances[editorid].destroy(); CKEDITOR.replace(editorid, {toolbar:tb}); }
    } else {
      if(realtime) $('#'+editorid).on('input', function() { UpdateByID(id);}); else $('#'+editorid).off('input'); 
    }
  }
  
  function LoadKeys(col,id,d) {var col='public', id='topmenu';
  //orderBy("name").limit(3)
   db.collection(col).doc(id).onSnapshot(function(doc) {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      // if(source=='Server') 
      //$('#TopLeft').html(json2str(doc.data()));
      $('#TopLeft').html(O2loop(doc.data()));
    });
  }
  function O2Button(d) {
    var s='';
    for (var k in d) { 
      if(d[k].Action) {
        s += '<button data-col='+d[k]['col']+ ' data-email='+d[k]['email']+' class=Populate onclick="'+d[k].Action+'($(this));">'+k+'</button>'; 
      } else { s += k;}
    }
    return s;
  }
  function Populate(datasrc,id) {
   db.doc(datasrc).onSnapshot(function(doc) { $('#'+id).html(O2Button(doc.data())); });
  }
  function sortObject(obj) { return Object.keys(obj).sort().reduce(function (result, key) {
          result[key] = obj[key];
          return result;
      }, {});
  }

  const getRandomNumber = (min, max) => { return Math.floor(Math.random() * (max - min + 1)) + min; };

  var list = {"you": 100, "me": 75, "foo": 116, "bar": 15};
  keysSorted = Object.keys(list).sort(function(a,b){return list[a]-list[b]})
  
  function O2loop(O) { s='';
   for (var k in O) { s += '<button>'+k+'</button>'; }
   return s;
  }
  function Dis(O) {  var col='public', id='topmenu';
      var v = O.v; 
      var s= '/'+col+'/<span contenteditable="true" id=doc>'+id+'</span> <br/>';
      s += " \
       <textarea id=TA rows=10 cols=50 oninput=\"  \
         if($('#realtime').is(':checked'))  \
          db.collection('public').doc($('#doc').text()).set({v: $(this).val()}, {merge: true }); \
            \">"+v+"</textarea><br/> \
        <button id=save onclick=\"save('public', $('#doc').text(), {'v': $('#TA').val()}); \">Save</button> \
        <button id=Load onclick=\"get('public',$('#doc').text(),{'v':1});\">Load</button> \
        <input type=checkbox id=realtime onclick=\"realtime_sync('public',$('#doc').text(),{});\">Realtime</input> \
       ";
      $('#QD2').html(s);
}
  function LoadValues(col,id,oid,O) {  
   db.collection(col).doc(id).onSnapshot(function(doc) {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        if(source=='Server') $('#TA').val(doc.data().v);
        $('#'+oid).html(doc.data().v);
    });
  }

 
  function escape_email(e) {return e.replace(/\./g, '&46'); }
  function dot2esc(e) {return e.replace(/\./g, '&46'); }
  function esc2dot(e) {return e.replace(/&46/g, '\.'); }

  
/**
 * image pasting into canvas
 * 
 * @param {string} canvas_id - canvas id
 * @param {boolean} autoresize - if canvas will be resized
 */
function CLIPBOARD_CLASS(canvas_id, autoresize) {
	var _self = this;
	var canvas = document.getElementById(canvas_id);
	var ctx = document.getElementById(canvas_id).getContext("2d");
	var ctrl_pressed = false;
	var command_pressed = false;
	var paste_event_support;
	var pasteCatcher;

	//handlers
	document.addEventListener('keydown', function (e) {
		_self.on_keyboard_action(e);
	}, false); //firefox fix
	document.addEventListener('keyup', function (e) {
		_self.on_keyboardup_action(e);
	}, false); //firefox fix
	document.addEventListener('paste', function (e) {
		_self.paste_auto(e);
	}, false); //official paste handler

	//constructor - we ignore security checks here
	this.init = function () {
		pasteCatcher = document.createElement("div");
		pasteCatcher.setAttribute("id", "paste_ff");
		pasteCatcher.setAttribute("contenteditable", "");
		pasteCatcher.style.cssText = 'opacity:0;position:fixed;top:0px;left:0px;width:10px;margin-left:-20px;';
		document.body.appendChild(pasteCatcher);

		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (paste_event_support === true || ctrl_pressed == false || mutation.type != 'childList'){
					//we already got data in paste_auto()
					return true;
				}

				//if paste handle failed - capture pasted object manually
				if(mutation.addedNodes.length == 1) {
					if (mutation.addedNodes[0].src != undefined) {
						//image
						_self.paste_createImage(mutation.addedNodes[0].src);
					}
					//register cleanup after some time.
					setTimeout(function () {
						pasteCatcher.innerHTML = '';
					}, 20);
				}
			});
		});
		var target = document.getElementById('paste_ff');
		var config = { attributes: true, childList: true, characterData: true };
		observer.observe(target, config);
	}();
	//default paste action
	this.paste_auto = function (e) {
		paste_event_support = false;
		if(pasteCatcher != undefined){
			pasteCatcher.innerHTML = '';
		}
		if (e.clipboardData) {
			var items = e.clipboardData.items;
			if (items) {
				paste_event_support = true;
				//access data directly
				for (var i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") !== -1) {
						//image
						var blob = items[i].getAsFile();
						var URLObj = window.URL || window.webkitURL;
						var source = URLObj.createObjectURL(blob);
						this.paste_createImage(source);
					}
				}
				e.preventDefault();
			}
			else {
				//wait for DOMSubtreeModified event
				//https://bugzilla.mozilla.org/show_bug.cgi?id=891247
			}
		}
	};
	//on keyboard press
	this.on_keyboard_action = function (event) {
		k = event.keyCode;
		//ctrl
		if (k == 17 || event.metaKey || event.ctrlKey) {
			if (ctrl_pressed == false)
				ctrl_pressed = true;
		}
		//v
		if (k == 86) {
			if (document.activeElement != undefined && document.activeElement.type == 'text') {
				//let user paste into some input
				return false;
			}

			if (ctrl_pressed == true && pasteCatcher != undefined){
				pasteCatcher.focus();
			}
		}
	};
	//on kaybord release
	this.on_keyboardup_action = function (event) {
		//ctrl
		if (event.ctrlKey == false && ctrl_pressed == true) {
			ctrl_pressed = false;
		}
		//command
		else if(event.metaKey == false && command_pressed == true){
			command_pressed = false;
			ctrl_pressed = false;
		}
	};
	//draw pasted image to canvas
	this.paste_createImage = function (source) {
		var pastedImage = new Image();
		pastedImage.onload = function () {
			if(autoresize == true){
				//resize
				canvas.width = pastedImage.width;
				canvas.height = pastedImage.height;
			}
			else{
				//clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			ctx.drawImage(pastedImage, 0, 0);
		};
		pastedImage.src = source;
	};
}
