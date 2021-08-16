function EditA(id){
  db.doc(id).get().then((doc) => {  var d=doc.data();
    $('#'+'TAAID').val(JSON.stringify(d));
 })
 alert(id);
}
class getdb {
  constructor(id) {  db.doc(id).get().then((doc) => {  this.data =doc.data(); })  };
}
function ToggleText(O) {   var c = $(O).text(), oid = $(O).attr('mainid');   $('#'+oid).html(c); }
function ToggleBold(O) {   var c = $(O).attr('class');    $('.'+c).css("font-weight","Normal");   $(O).css("font-weight","Bold"); }
function ToggleColor(O) {  var c = $(O).attr('class');  $('.'+c).css("background-color", ""); $(O).css("background-color", "yellow"); }
class Assessment {
    constructor(O) { 
      for(var k of Object.keys(O)) {this[k] = O[k];} 
      if(!O.hasOwnProperty('col')) this['col'] = 'Q'; 
      if(!O.hasOwnProperty('id')) this['id'] = 'test1'; 
      if(!O.hasOwnProperty('oid')) this['oid'] = 'ContentRight';
      this['uqid']=uniqid();  
      //console.log(this);
    }; 
    
    EditRaw(O){ var id = O.id?O.id:this.id, oid=O.oid?O.oid:this.oid, s='', sq='Q2A <br/>'; 
      db.doc(id).get().then((doc) => {  var d=doc.data(), iq=0; 
        //for (var qid of d.Q) { iq++; s += `<button data-id=${qid} data-oid=QuickQ onclick="LoadOneQ($(this).data());">${iq}</button>`; }
        if(d.Q) s += '<span id=QinAssessment>Qs:'+this.Array2Qstr(d.Q)+'</span>'; 
        s +='<textarea rows=10 style="width: 100%; max-width: 100%; display:none;" id=ARaw>'+JSON.stringify(d, null, 2)+'</textarea>';
        s += '<br/><button onclick=" $('+"'#ARaw'"+').toggle();">Raw</button>'
        s += '<button data-id='+id+' data-inid=ARaw onclick="new Assessment({}).SaveRaw($(this).data());">Save</button>';
        s += '<button  data-aidta=ARaw onclick="new Assessment({}).HighLightQ($(this).data());">Selected</button>';
        s += '<button  data-msg="Q:" data-oid=ListAQ data-id='+id+' onclick="new Assessment({}).LoadOne($(this).data());">Load</button>';
        s += '<br/>';
        s += '<div  id=ListAQ></div>'; 
        s += '<div  id=QuickQ></div><hr/>';
        s += '<div  id=ListQ></div>'; 
        sq += '<button  data-msg="<hr/>" data-oid=ListQ data-aidta=ARaw onclick=" \
           var d=$(this).data(); d.col=$(\'#ListQcol\').val(); new Assessment({}).ListQ(d); \
         ">ListQ</button>';
        sq += "<input id=ListQcol value='/COURSES/Math-9th/Q'/>"; 
        $('#'+oid).html(s); $('#'+'Left2').html(sq);
        if(debug) console.log(O); 
     })
      
    }
    SaveRaw(O){  //console.log(O);
      var d = JSON.parse( $('#'+O.inid).val()); 
      d.modifier={'at':firebase.firestore.Timestamp.now().toMillis(), 'by':firebase.auth().currentUser.email};
      db.doc(O.id).set(d); 
    }

    Q2TA(O) { var taid=O.aidta; 
      var d=JSON.parse($('#'+taid).val()), index = d.Q.indexOf(O.qid);
      index === -1 ?  d.Q.push(O.qid) : d.Q.splice(index, 1);;
      $('#'+taid).val(JSON.stringify(d, null, 2));
      $('#QinAssessment').html(this.Array2Qstr(d.Q));

      //console.log(d); 
    }
    ListQ(O) { var col=O.col;  //console.log(O); return;
      db.collection(col).get().then((qS) => { var s=O.msg?O.msg:'', iq=0;
        qS.forEach((doc) => { iq++; var qid = col+'/'+doc.id; 
          //var d = ' data-qid='+qid+' data-aidta='+O.aidta;
          var d = ` data-qid=${qid} data-aidta=${O.aidta} data-col=${col} `;

          s +='<button class=QList '+ d + ' onclick=" \
           var Anew=new Assessment({}); Anew.Q2TA($(this).data()); Anew.HighLightQ($(this).data()); ToggleBold($(this)); \
           ">'+iq+'</button>';
        });
        $('#'+O.oid).html(s);
        this.HighLightQ({aidta:O.aidta});
      });
      if(debug) console.log('A.js:ListQ', O)
      return true;
    }

    HighLightQ(O) {
      var d=JSON.parse($('#'+O.aidta).val()),  qid='/COURSES/Math-9th/Q/5MJFxYeMUrFpvcQnKgod';
      $(".QList").css("background-color", "");
      for (var qid of d.Q) {  $("[data-qid='"+qid+"']").css("background-color", "yellow"); } 
    }
    List(O){  var col = O.col?O.col:this.col, oid=O.oid; 
        db.collection(col).get().then((qS) => { 
            var s = '', iq=0; 
                 qS.forEach((doc) => {  iq++; var aid=col+'/'+doc.id; var n=iq;
                   //var n=(doc.data().a.name)? doc.data().a.name:iq;
                   var d = ' data-id='+aid+' data-oid='+O.oid;
                   s +='<button class=AList '+ d + ' onclick=" \
                   new Assessment({}).EditRaw($(this).data()); ToggleBold($(this)); ToggleColor($(this)); \
                   ">'+iq+'</button>';
                   //console.log(doc.data().a.name?1:2);
                 });

                 s += '<div  id=TAAID></div>'; 


                 $('#'+oid).html(s);
                 console.log(s); 
          });
    }
    Setup(O){  var col = O.col?O.col:this.col, oid=O.oid, uqid=uniqid(); 
      db.collection(col).get().then((qS) => { 
          var s = '', iq=0; 
               qS.forEach((doc) => {  iq++; var aid=col+'/'+doc.id, n=doc.data().a.name?doc.data().a.name:iq; 
                 s +=`<button data-id=${aid} data-oid=QList${uqid} data-oid2=QDisplay${uqid} class=AList onclick="
                 new Assessment({}).LoadOne(\$(this).data()); ToggleBold(\$(this)); ToggleColor(\$(this)); 
                 ">${n}</button>`;
               });
              
               if(role=='instructor') {
                s +=`<p/><button data-col=${col} data-oid=Middle2 onclick=" A.New({col:'${col}'}); A.Setup(\$(this).data()); ">Add New</button>`;
               }

               var ss=`
               <table border="1" width=100% CourseID=${col}>
               <tr >
               <td width=10% id=AList${uqid} valign=top> ${s}</td> 
               <td id=QDisplay${uqid} valign=top> </td> 
               <td width=10% id=QList${uqid} valign=top></td> 
               </tr>
               </table>
               `; 

               $('#'+oid).html(ss);
        });
        if(debug) console.log('A.js: Setup', O);
  }  
   ListOne(O){  var id=O.id?O.id:this.id, oid=O.oid?O.oid:this.oid; 
    db.doc(id).get().then((doc) => {  
       var s='<button onclick="EditQ('+"'"+doc.id+"'"+');">'+doc.id+'</button>';
       $('#'+oid).html(s);
    })
    if(debug) console.log('A.js ListOne', O);
   }

   LoadOne(O){  
     db.doc(O.id).get().then((doc) => {  var d=doc.data(), Desc=d.Desc?d.Desc:'', uqid=uniqid();
     var s='', s2='', iq=0, Qs=doc.data().Q, oid=O.oid2?O.oid2:'Middle12', Qstr=JSON.stringify(Qs), id=O.id;
     var k='Desc'; s2 += DisplayByKey(O.id, k, d[k], k+uqid, {tb:'ckbasic'}); 

     for (var qid of Qs) { 
      s2 += `<span id=${oid}-${iq}></span>`;  
      iq++; 
      s += `<button class=LoadOne data-id=${qid} data-oid=${oid} onclick="LoadOneQ($(this).data()); ToggleBold(\$(this)); ToggleColor(\$(this)); ">${iq}</button>`; 
     }
     if(Qs.length) s += `<button class=LoadOne onclick='LoadQ({id:${Qstr}, oid:"${oid}"}); ToggleColor(\$(this)); '>All</button>`; 
     if(role=='instructor') {
       s +=`<button onclick=" EditRawByID('${id}', '${oid}');  ">Edit</button>`;
     }

     s += `<button  onclick="new ListQ({col:'/public', oid:'${oid}'}).ListAllQ(); ">AddQ</button>`;
     s += "<input id=ListQcol value='/COURSES/Math-9th/Q'/>"; 


      $('#'+O.oid).html(s);  //     $('#'+O.oid).html(this.Array2Qstr(doc.data().Q)); 
      $('#'+oid).html(s2); // create a place-holder for all Qs in O.oid2 
     })   
    
    if(debug) console.log('LoadOne', O); 
   }

   Array2Qstr(Q) { var s='', iq=0, oid='Middle12';
    for (var qid of Q) { iq++; s += `<button data-id=${qid} data-oid=${oid} onclick="LoadOneQ($(this).data());">${iq}</button>`; }
    return s; 
   }

   ListDropdown(O){  var col = O.col?O.col:this.col, oid=O.oid, mainid=O.mainid, name=O.name?O.name:"A"; 
    db.collection(col).get().then((qS) => { 
        var s='',iq=0; 
         qS.forEach((doc) => {  iq++; var aid=col+'/'+doc.id; var n=iq;
            s +=`<a href="#" mainid=${mainid} class=AList onclick="A.LoadOne({id:'${aid}', oid:'Top21'}); ToggleBold($(this)); ToggleColor($(this)); ToggleText($(this)); ">${iq}</a>`;
          });
          var ss = O.v==2? `<div class="column"><div class="row">${s}</div></div>`:s; 
          s= `<div class="dropdown"><button id=${mainid} class="dropbtn">${name}</button><div class="dropdown-content"> ${ss} </div></div>`; 
          $('#'+oid).html(s);
          if(debug) console.log(s);
      });
 
}

    
   New(O){ var col=O.col?O.col:this.col; 
     var qid='%s%s'.format(firebase.firestore.Timestamp.now().toMillis(),getRandomNumber(100000,999999));
     console.log(qid);
     db.collection(col).doc(qid).set(
       {
        'Q':[],
        'Desc':'Desc',
         'a':{'name':'New'}, 
         'creater':{
             'at':firebase.firestore.Timestamp.now().toMillis(), 
             'by':firebase.auth().currentUser.email
            },
            'modifier':{
                'at':firebase.firestore.Timestamp.now().toMillis(), 
                'by':firebase.auth().currentUser.email
               }
        }
       ); 
       if(debug) console.log(`New Assessment '${col}/${qid}' created!`);
    }
  }
