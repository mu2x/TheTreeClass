var tr_down='&#x25BC', tr_up='&#x25B2'; 

class Info { 
  constructor(O) { var O=(arguments.length)?O:{};
    if(arguments.length) { for(var k of Object.keys(O)) {this[k] = O[k];} 
    } else {this.col='public'; this.id='test1';}
    if(O.col && O.id) this.id=O.col+'/'+O.id; 
    this.uqid = uniqid(); 
  }; 

  List(O) {  var id=O.id, col=O.col, uqid=uniqid(), s=''; 
    var queryid = O.queryid?O.queryid:'#'+O.oid; 
    db.collection(O.col).get().then((qS) => {  var iq=0;  
      qS.forEach((doc) => {  iq++; var id=col+'/'+doc.id, d=doc.data(), a=d.a?d.a:{}, oid=uqid+doc.id, n=a.name?a.name:id;   
        s += `<br/> ${iq} ${n}  
          <button onclick="EditRawByID('${id}','${oid}'); \$('#${oid}').toggle();">Raw</button>
          <div style='display:none;' id=${oid}></div>`; 
      })   
      if(debug) console.log(s);
      $(queryid).html(s);     
    }); 
  }

  UpdateArray(id,k,v) {
    db.doc(id).get().then(doc=>{var d=doc.get(k)?doc.get(k):[]; 
      d.push(v); 
      db.doc(id).update({k:d}); 
    })
    console.log(id,k,v); 
  }
  ListAdd(O) {  var id2=O.id, col=O.col, uqid=uniqid(), s='', key=O.k; 
  var queryid = O.queryid?O.queryid:'#'+O.oid; 
  s += `From ${col} to ${id2}:${key}`; 
   db.collection(O.col).get().then((qS) => {  var iq=0;  
     qS.forEach((doc) => {  iq++; var id=col+'/'+doc.id, d=doc.data(), a=d.a?d.a:{}, oid=uqid+doc.id, n=a.name?a.name:id;  
       //s += DisplayByKey(id, `${k}.v`, d[k].v?d[k].v:'v', 'v'+k+uqid, {tb:'ckfull'});
       var sadd = `<button data-qid=${id} class=QList onclick="
         db.doc('${id2}').get().then(doc=>{var d=doc.get('${key}')?doc.get('${key}'):[]; 
           var index = d.indexOf('${id}');
           index === -1 ?  d.push('${id}') : d.splice(index, 1);;
           db.doc('${id2}').update({'${key}':d}); 
           A.HighLightQ({Q:d}); 
           if(debug) console.log(d);
         }); 

         //I.UpdateArray('${id2}', '${key}','${id}'); 
         ">${iq}</button>`; 
       s += `<br/> ${sadd} ${n}  
        <button onclick="EditRawByID('${id}','${oid}'); \$('#${oid}').toggle();">Raw</button>
        <div style='display:none;' id=${oid}></div>`; 
     })   
     if(debug) console.log(s);
     $(queryid).html(s);  

     setTimeout(function(){  db.doc(id2).get().then(doc=>{var d=doc.get(key)?doc.get(key):[];  A.HighLightQ({Q:d});  });   }, 100); // Initial Hightlight

     
  
   }); 
}

  EditRaw(O) {  var uqid=uniqid(), inid=O.id;
    db.doc(O.id).get().then((doc) => {  var d=doc.data(), iq=0, s='';  
      s += `<textarea rows=10 style="width: 100%; max-width: 100%;" id=${uqid} >`+JSON.stringify(d)+'</textarea>'; 
      s += `<button data-id=${inid} data-taid=${uqid} onclick="new Info().SaveRaw( \$(this).data());">Save</button>`; 
      $('#'+O.oid).html(s);    
    }); 
  }
  data() {db.doc(this.id).get().then(doc=>{this.d = doc.data();}); }
  Alldb() {db.doc(this.id).get().then(doc=>{this.All({d:doc.data()}); }); }

  All(O) { 
    var O=(arguments.length)?O:{}; var id=O.id?O.id:this.id, d={}, uqid=this.uqid, s='', i=0; 
    var oid=O.oid?O.oid:'Middle2';
      d=O.d;
      s += `<button onclick="EditRawByID('${id}', '${oid}');">Raw2</button>`; 
      s += DisplayByKey(id, `v`, d.v?d.v:'v', 'v'+uqid, {tb:'ckfull'});
      for(var k in d) { if(k=='a'||k=='v') continue; 
        var a=d[k].a?d[k].a:{}, v=d[k].v?d[k].v:'', ss='', ii=0; i++; 
        ss += DisplayByKey(id, `${k}.v`, d[k].v?d[k].v:'v', 'v'+k+uqid, {tb:'ckfull'});
        var dd = (typeof d[k] == 'object' && k!='a')?d[k]:{}; 

        for(var kk in dd) { if(kk=='a'||kk=='v') continue; ii++; 
          var iii=0, sss='', ddd = (typeof d[k][kk] == 'object')?d[k][kk]:{}; 
          sss += DisplayByKey(id, `${kk}.${k}.v`, d[k][kk].v?d[k][kk].v:'v', 'v'+k+kk+uqid, {tb:'ckfull'});

          for (var kkk in ddd) { if(kkk=='a'||kkk=='v') continue; iii++; 
            var iiii=0, ssss='', dddd = (typeof d[k][kk][kkk] == 'object')?d[k][kk][kkk]:{}; 
            ssss += DisplayByKey(id, `${kkk}.${kk}.${k}.v`, d[k][kk][kkk].v?d[k][kk][kkk].v:'v', 'v'+k+kk+kkk+uqid, {tb:'ckfull'});

            for (var kkkk in dddd) { if(kkkk=='a'||kkkk=='v') continue; iiii++; 
              ssss += `<br/>${i}.${ii}.${iii}.${iiii}:` 
              ssss += DisplayByKey(id, `${kkkk}.${kkk}.${kk}.${k}.v`, d[k][kk][kkk][kkkk].v?d[k][kk][kkk][kkkk].v:'v', 'v'+k+kk+kkk+kkkk+uqid, {tb:'ckfull'});
            }
            sss += `<br/>${i}.${ii}.${iii}:` + ssss; 
          }
          ss += `<p/>${i}.${ii}:` + sss; 
        }

        s += `<hr/>${i}:` + ss; 
      }
      this.s=s; 
      $('#Middle2').html(s);
  }
  SaveRawTA(O) {      db.doc(O.id).set(JSON.parse($('#'+O.taid).val()) );    }

  dropdownOneCol(O) { var s='', mainid=O.mainid?O.mainid:'dropbtn2', d=O.d, id=O.id, uqid=uniqid(), oid=O.oid?O.oid:'Middle2'; 
  var i=0, a=d.a?d.a:{}, v=d.v?d.v:'', n=a.n?a.n:k;
  admin = (role=='instructor')?1:0; 
  for (var k in d) { var ii=0, ss='',  dd= (typeof d[k] == 'object')?d[k]:{}; 
    if(k=='a'||k=='v') continue;
    var aa=dd.a?dd.a:{}, nn=aa.n?aa.n:k; i++; 
    for (var kk in dd) { var ddd= (typeof dd[kk] == 'object')?dd[kk]:{}; 
      if(kk=='a'||kk=='v') continue;
      var aaa=ddd.a?ddd.a:{}, nnn=aaa.n?aaa.n:kk; ii++; 
      ss += `<a href="#">${i}.${ii} ${nnn}</a> `; 
    }
    s += `<b>${i}:  ${nn} </b> <div class="row"> <div class="column"> ${ss} </div> </div> `;

  }
  var tid=`dropdown-courses-content${uqid}`; 
  if(admin) s += `<button  onclick="I.SectionEdit2('${id}','${oid}',{});">Edit</button>`; 
    var stmp =`
    <div id=dropdown2 class="dropdown" data-toggle=1 onclick=" var d=\$(this).data(); if(d.toggle) $('#toggle${tid}').toggle();">
      <button id=dropbtn1 class="dropbtn">Concepts</button>
      <div id=toggle${tid} class="dropdown-content" >  ${s}   </div>
    </div>
    `;   
    return stmp; 
  }

  Load(id,k,oid) { var s=''; 
    console.log(id,k,oid);
    db.doc(id).get().then(doc=>{ var d=doc.get(k), C=d.C?d.C:[];
      for(var i in C) {
        db.doc(C[i]).get().then(doc2=>{var d2=doc2.data(); 
          s += d2.Desc;
          $('#'+oid).html(s);
        });

      }
    });
    //EditRaw(A.$(this).data());
  }
  dropdownOneRow(O) { var im1=0, s='', d=O.d, id=O.id, uqid=uniqid(), oid=O.oid?O.oid:'Middle2'; 
  var i=0, a=d.a?d.a:{}, v=d.v?d.v:'', n=a.n?a.n:k;
  admin = (role=='instructor')?1:0; 
  for (var k in d) { var ii=0, ss='',  dd= (typeof d[k] == 'object')?d[k]:{}, aa=dd.a?dd.a:{}, nn=aa.n?aa.n:k; 
    if(k=='a'||k=='v'  ||k=='C' ||k=='A' ||k=='Q'|| aa.hide==1) continue;
    i++; im1=i-1;
    for (var kk in dd) { var ddd= (typeof dd[kk] == 'object')?dd[kk]:{}, aaa=ddd.a?ddd.a:{}, nnn=aaa.n?aaa.n:kk; 
      if(kk=='a'||kk=='v'  ||kk=='C' ||kk=='A' ||kk=='Q'|| aaa.hide==1) continue;
      ii++;  
      ss += `<a href="#" onclick="I.Load('${id}','${k}.${kk}','Middle2');">${im1}.${ii} ${nnn}</a> `; 
    }
    s += ` <div class="column"> <a href="#"><b>${im1}:  ${nn} </b></a> ${ss} </div> `;
  }
  var tid=`dropdown-courses-content${uqid}`; 
  if(admin) s += `<button  onclick="I.SectionEdit2('${id}','${oid}',{});">Edit</button>`; 
    var stmp =`
    <div id=dropdown2 class="dropdown" data-toggle=1 onclick=" var d=\$(this).data(); if(d.toggle) $('#toggle${tid}').toggle();">
      <button id=dropbtn1 class="dropbtn">Concepts</button>
      <div id=toggle${tid} class="dropdown-content" >  <div class="row"> ${s} </div>  </div>
    </div>
    `;   
    return stmp; 
  }

  SectionEdit2(id,oid,O) {
    if(O.realtime) db.doc(id).onSnapshot(function(doc) { $('#'+oid).html(I.SectionEdit({d:doc.data(), id:id, oid:oid})); }); 
    else db.doc(id).get().then(function(doc) { $('#'+oid).html(I.SectionEdit({d:doc.data(), id:id, oid:oid})); }); 
  }
  
  hide(id,k,v) { var v=(v==1)?0:1;  return `<button  onclick=" 
   db.doc('${id}').get().then(doc=>{ var v=doc.get('${k}'); db.doc('${id}').update({'${k}':(v==1)?0:1 });  });
   var e=\$(this.parentNode); 
   if(e.attr('strikethrough')==1) {e.attr('strikethrough',0); } else e.attr('strikethrough',1); 

  ">&times;</button>`; }
  KeyEdit(id, k, v) {
    return `
    <span class=Editable ondblclick="
      if(\$(this).attr('contenteditable')=='true') {
       db.doc('${id}').update({'${k}':\$(this).text() });  \$(this).attr('contenteditable','false'); 
     } else {
       \$(this).attr('contenteditable','true'); 
     }      
   ">${v}<span>
    `;
  }
  SectionEdit(O) { var s='', mainid=O.mainid?O.mainid:'dropbtn2', d=O.d, id=O.id, oid=O.oid, uqid=uniqid(); 
  var i=0, a=d.a?d.a:{}, v=d.v?d.v:'', n=a.n?a.n:k;
  for (var k in d) { var ii=0, ss='',  dd= (typeof d[k] == 'object')?d[k]:{}; 
    if(k=='a'||k=='v' ||k=='C' ||k=='A' ||k=='Q') continue;
    var aa=dd.a?dd.a:{}, nn=aa.n?aa.n:k, hide=aa.hide?aa.hide:0; i++; 
    for (var kk in dd) { var ddd= (typeof dd[kk] == 'object')?dd[kk]:{}; 
      if(kk=='a'||kk=='v'  ||kk=='C' ||kk=='A' ||kk=='Q') continue;
      var aaa=ddd.a?ddd.a:{}, nnn=aaa.n?aaa.n:kk, hhide=aaa.hide?aaa.hide:0; ii++; 
      var key=this.KeyEdit(id,`${k}.${kk}.a.n`,nnn), strike=this.hide(id,`${k}.${kk}.a.hide`, hhide);
      var List=this.ListB(id,`${k}.${kk}`,{});
      ss += `<span strikethrough=${hhide}><a href="#">${i}.${ii} ${key} </a> ${strike} </span> ${List} <br/>`; 
    }
    if(admin) ss += `<button onclick="db.doc('${id}').update({'${k}.${ii}':{a:{n:'new'}, v:'v'} });" href="#">New Subsection</button> `; 
    
    var key=this.KeyEdit(id,`${k}.a.n`,nn), strike=this.hide(id,`${k}.a.hide`, hide); 
    var List=this.ListB(id,k,{});
    s += `<div strikethrough=${hide}>  <b>${i}: ${key}</b>  ${strike} ${List}<div> ${ss} </div> </div> `;
  }
  s += `<p/><button onclick="db.doc('${id}').update({'${i}':{a:{n:'new'}, v:'v'} }); ">New Section</button>`; 
  s += ` <button class=uqid onclick="EditRawByID('${id}','${oid}');  ">Raw</button>`; 

  return s; 
  }

  ToggleHighlight(O) { var qrid='#'+O.id;  
    $(qrid).toggle(); 
    if($(qrid).css('display') == 'none') {O.e.html(tr_down); O.e.css('background-color',''); } 
    else {    O.e.html(tr_up); O.e.css('background-color','yellow'); }
  }
  ListB(id, k, O){ var s='', uqid=uniqid('',true); 
      return `
        <button onclick="I.ToggleHighlight({id:'${uqid}',e:\$(this) }); ">${tr_down}</button> 
        <div id=${uqid} style='display:none;border-style: solid;'>
          <button onclick="I.ListAdd({id:'${id}', k:'${k}.C', col:'${id}/Concepts',oid:'${uqid}M1'}) ; " >Concepts</button> 
          <button onclick="I.ListAdd({id:'${id}', k:'${k}.Q', col:'${id}/Q',oid:'${uqid}M1'}) ; " >Q</button>
          <button onclick="I.ListAdd({id:'${id}', k:'${k}.A', col:'${id}/A',oid:'${uqid}M1'}) ; " >Assessments</button>
          <div id=${uqid}M1 class=M1></div>
        </div>
        `; 
  }
}


function getAllInputValues(eid) { var d=[], v=''; 
  $(eid).each(function() { var e=$(this); 
    if(e.attr('type')=='checkbox') v = e.prop('checked'); else v=e.val(); 
    d.push(v); //d.push($(this).val());
  }); 
  return d; 
}
function LoadAllInputValues(eid, d) { var k=0; 
  $(eid).each(function() {var e=$(this), v=d[k]; 
    if(e.attr('type')=='checkbox') e.prop('checked', v); else e.val(v); 
    ++k;
  }); 
}

class IO3 {
  constructor(O) {
    var dflt = {uqid:uniqid(), col:'public', doc:'test1', oid:'middle', db:firebase.firestore(), dtype:'html', tb:'ckbasic'};
    for(var k of Object.keys(dflt)) {this[k] = dflt[k];} 
    for(var k of Object.keys(O)) {this[k] = O[k];}  // Overwrite the defalut values
    this.ignoreKeys=['a','group','groups','key','keys'];
  }
//--------
ListAll(O){ 
   LogUserInfo('IO3: ListAll ' + this.col);
   var OBy = (O.hasOwnProperty('orderBy'))? O['orderBy']:firebase.firestore.FieldPath.documentId();
   db.collection(this.col).orderBy(OBy).get().then((qS) => { 
     var s = '', iq=0; 
          s += 'Created [<button clicked=0 onclick=" toggleVK(\'.createdAt\', this); ">At</button>'; 
          s += '<button onclick=" toggleVK(\'.createdBy\', this); ">By</button>]<br/>'; 
          s += 'Modified [<button onclick=" toggleVK(\'.modifiedAt\', this); ">At</button>'; 
          s += '<button onclick=" toggleVK(\'.modifiedBy\', this); ">By</button>]<br/>'; 

          qS.forEach((doc) => {  iq++; 
            var cAt = (doc.data().createdAt)? new Date(doc.data().createdAt).toLocaleString():'';
            var mAt = (doc.data().modifiedAt)? new Date(doc.data().modifiedAt).toLocaleString():'';
            var cBy = (doc.data().createdBy)? doc.data().createdBy:'', mBy = (doc.data().modifiedBy)? doc.data().modifiedBy:''; 
            var createdAt = '<span class=createdAt style="display:none;">'+cAt+'<br/></span>';
            var createdBy = '<span class=createdBy style="display:none;">'+cBy+'<br/></span>';
            var modifiedBy = '<span class=modifiedBy style="display:none;">'+mBy+'<br/></span>';
            var modifiedAt = '<span class=modifiedAt style="display:none;">'+mAt+'<br/></span>';

            var b='<button class=QButtons data-col='+this.col+ ' data-doc='+doc.id+' onclick="\
            new IO3($(this).data()).Edit(\'ContentMiddle\'); \
             $(\'.QButtons\').css(\'font-weight\',\'normal\'); \
             $(this).css(\'font-weight\',\'bold\'); \
             ">'+iq+'</button>' + createdAt + createdBy + modifiedBy + modifiedAt;
            s += b; 
          });
          $('#ContentRight').html(s);
   });
  }

 fb_put(col,id,d) {
  db.collection(col).doc(id).set(d, {merge: true })
  .then(function(docRef) { console.log("Document written"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_update(col,id,d) {
  db.collection(col).doc(id).update(d)
  .then(function(docRef) { console.log("Document updated"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_get(col,doc) {
    db.collection(col).get().then((querySnapshot) => {
   	 querySnapshot.forEach((doc) => { console.log(`${doc.doc} => ${doc.data()}`); });
    });
 }
Edit(outputid) { this.oid = outputid; self = this;
       db.collection(this.col).doc(this.doc).get().then(function(doc) { 
        if (doc.exists) { $('#'+self.oid).html( self.O2html(doc.data()) );  } 
      });
}
Display(outputid) { var docid=this.col+'/'+this.doc; self=this;
       db.doc(docid).get().then(function(doc) { if (doc.exists) { $('#'+outputid).html(self.JSON2html(doc.data()));  } });
}
getOne(O) { self=this; 
       db.this(this.col+'/'+this.doc).get().then(function(doc) { if (doc.exists) { self.data = doc.data();  } });
       return self.data;
}

JSON2html(d) {  var s='',uqid=this.uqid;
 var a=d.a?d.a:{}; 
 if(d.a.timer) { var dt=d.a.timer;
  var ss = "Elapsed: <span id=elapsedtime></span> (left <span id=timer></span>)";
  var sb = "<button id=startTimer onclick=\"startTimer(%s,'timer'); elapsedTime(%s,'elapsedtime'); $('#ssID').show(); \">Start</button>".format(dt,dt);
  s += "<span style='float:right;'><span id=ssID style='display:none;' > %s</span> %s </span>".format(ss,sb); 
 }
 for(var k in d) { 
   if(this.ignoreKeys.indexOf(k)>-1) continue; 
   if(!(typeof d.k== 'object')) {
     s += '<span id=Display%s data-v=%s>%s</span>'.format(uqid,k,d[k]);
   }
 }
 var eid='#Display'+uqid+ ' :input'; 
 var Idb = '/users/%s/%s/%s'.format('instructor',this.col,this.doc);
 var udb = '/users/%s/%s/%s'.format(uinfo.email,this.col,this.doc);
 //s += '%s %s %s'.format(eid,Idb,udb);
 s += "<button onclick=\"db.doc('%s').set({'inputs':getAllInputValues('%s')});\">Submit</button>".format(udb,eid);
 s += "<button onclick=\"db.doc('%s').set({'inputs':getAllInputValues('%s')});\">Instructor Submit</button>".format(Idb,eid);
 s += "(Ans<button onclick=\"db.doc('%s').get().then(function(doc) {if(doc.exists) LoadAllInputValues('%s',doc.data() ); });\">My</button>".format(udb,eid);
 s += "<button onclick=\"db.doc('%s').get().then(function(doc) {if(doc.exists) LoadAllInputValues('%s',doc.data() ); });\">Instructor</button>)".format(Idb,eid);
 return s;
}

LoadButtons(O) {  var s ='';
  for(var k in O) {
    s = "<button onclick=\"  \
      var d=$('#"+elID+"').data(); d.dtype='html'; var I=new IO3(d); I.Edit('"+oID+"');  \" \
      >Load</button>"; 
  }
}
 Editable(k,v) { 
   return "<span contenteditable=true oninput=\" $('#"+this.uqid+"').attr('"+k+"', $(this).text()); \">"+v+"</span>";
 }
 O2html(O) { var dtype=this.dtype,col=this.col, doc=this.doc, uqid=this.uqid,  oid=this.oid;
    var attr = JSON.stringify(O.a, null,1);
    tb=ifSet(O,'a.tb')? cktb(O.a.tb) : cktb('ck4basic'); 
    var v = O.v, key='v';

    if(dtype=='json') var v = JSON.stringify(O, null,1);
    if(O.a && O.a.PrettyPrint===0) var v = JSON.stringify(O);

    var colhtml = this.Editable('data-col',col), dochtml = this.Editable('data-doc',doc);
    var Raw = "<button onclick=\"var d=$('#"+uqid+"').data(); d.dtype='json'; var I=new IO3(d); I.Edit('"+oid+"');  \">Raw</button>"; 
    var Dis = "<button onclick=\"var d=$('#"+uqid+"').data(); d.dtype='json'; var I=new IO3(d); I.Display('"+oid+"');  \">Dis</button>"; 
    var editor = (dtype=='html')?'ckeditor':'TA';
    if(CKEDITOR.instances[uqid+key]) CKEDITOR.instances[uqid+key].destroy();
    var eid=uqid+key;
    if(dtype=='json') var ss = "<br/><textarea cols=50 rows=10 data-key=" + key + " id="+ uqid+key+ ">"+v+"</textarea><br/> ";
    else var ss = "<div data-key=" + key + " id="+ uqid+key+ " \
      ondblclick=\"  $('#"+uqid+"close').show(); CKEDITOR.replace('"+eid+"',{toolbar:tb}); \" \
      >"+v+"</div>";
    var s = " \
     <span data-col=" + col + " data-doc="+doc+ " data-oid="+this.oid+" data-key="+key+" data-dtype='"+dtype+"' data-uqid="+uqid+" id="+ uqid+ ">\
        /"+colhtml+"/"+dochtml+ LoadButton(uqid,this.oid) + Raw + Dis + ss + " \
     </span> \
       <button class="+uqid+"hide onclick=\" UpdateByID('"+uqid+"'); \">Save</button> \
       <button class=hide id="+uqid+"close onclick=\" $(this).hide(); if(CKEDITOR.instances['"+eid+"']) CKEDITOR.instances['"+eid+"'].destroy(); \">Close</button> \
       <input id="+ uqid +"update type=checkbox checked=true>Update</input> | \
       <input id="+ uqid +"realtime type=checkbox onclick=\" RealtimeByID('"+uqid+"'); \">Realtime</input> \
       <div id="+uqid+"msg>"+uqid+"</div>";
        //if(editor=='ckeditor') s += "<script> CKEDITOR.replace('"+uqid+key+"',{toolbar:tb}); <\/script> ";
    return s;
 }
}

class IO2 {
  constructor(O) {
    for(var k of Object.keys(O)) {this[k] = O[k];} 
    if(!O.hasOwnProperty('col')) this['col'] = 'public'; 
    if(!O.hasOwnProperty('doc')) this['doc'] = 'test1'; 
    if(!O.hasOwnProperty('db')) this['db'] = firebase.firestore(); 
  }

 fb_put(col,id,d) {
  db.collection(col).doc(id).set(d, {merge: true })
  .then(function(docRef) { console.log("Document written"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_update(col,id,d) {
  db.collection(col).doc(id).update(d)
  .then(function(docRef) { console.log("Document updated"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_get(col,id,d) {
    db.collection(col).get().then((querySnapshot) => {
   	 querySnapshot.forEach((doc) => {
        	console.log(`${doc.id} => ${doc.data()}`);
    	});
    });
 }

 Edit(col, doc, O) {
    var uqid=uniqid();
    var attr = JSON.stringify(O.a, null,1);
    var v = O.v, key='v';
    var colhtml = "<span contenteditable=false>"+col+"</span>";
    var dochtml = "<span contenteditable=true oninput=\" var d=$('#"+uqid+"').data(); d.doc = $(this).text(); \">"+doc+"</span>";

    return s = " \
     <span data-col=" + col + " data-doc="+doc+ " data-key="+key+" data-type=html data-uqid="+uqid+" id="+ uqid+ ">\
        /"+col+"/"+dochtml+ LoadButton(uqid)+" \
       <br/><textarea cols=50 rows=10 data-col=" + col + " id="+ uqid+key+ ">"+v+"</textarea><br/> \
     </span> \
       <button class="+uqid+"hide onclick=\" UpdateByID('"+uqid+"'); \">Save</button> \
       <input id="+ uqid +"update type=checkbox>Update</input> | \
       <input id="+ uqid +"realtime type=checkbox onclick=\" RealtimeByID('"+uqid+"'); \">Realtime</input> \
        <button onclick=\"if(CKEDITOR.instances['"+uqid+key+"']) CKEDITOR.instances['"+uqid+key+"'].destroy();\">TA</button> \
        <button onclick=\"if(!CKEDITOR.instances['"+uqid+key+"']) CKEDITOR.replace('"+uqid+key+"',{toolbar:tb});\">CK</button> \
       <div id="+uqid+"msg>msg</div>";
        //<script> CKEDITOR.replace('"+uqid+"TA'); <\/script> \
 }
}
