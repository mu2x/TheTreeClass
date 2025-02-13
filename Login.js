// Written & Copyrighted by V. Kumar (vkumar@utep.edu), Updated 2020-11-20
     function SignIn(O) {
      var errors;
      if(O.provider=='microsoft') { 
          var provider = new firebase.auth.OAuthProvider('microsoft.com');
      } else { 
          var provider = new firebase.auth.GoogleAuthProvider(); 
      }
      if(O.option=='Redirect') { // Sign-in with redirect
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) { var token = result.credential.accessToken; }
            var user = result.user;
            LogUserInfo('signInWithRedirect');
        });
      } else { // Sign-in with Popup [Default]
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken, user = result.user;
            LogUserInfo('signInWithPopup');
        }).catch(function(error) { errors = error; });
      }
    }

    function SignOut(O) {
         firebase.auth().signOut().then(function(results) {
        }).catch(function(error) { errors = error;});
    }

      function LoginDisplay(O) { 
        var id= O.hasOwnProperty('id')? O.id : 'Login';
       $('#'+id).html(
         '<span>Sign-in with </span> ' 
         + '<button onclick="SignIn({option:'+"'Popup'"+'});">Google</button> '
         + '<button onclick="SignIn({option:' + "'Popup',provider:'microsoft'" + '});">Microsoft</button>'
       );
      } 
      function LoggedOutDisplay(O,user) { 
        var id= O.hasOwnProperty('id')? O.id : 'Login';
        var d=$('#'+id).data(); 
        var n = '<span title='+user.email+'>'+user.displayName+'</span>'; 
        var signout = '<button onclick="SignOut({});">Logout</button> '; 

        if(d.display=='simple') {
          $('#'+id).html(n+signout); return;
        }
        console.log(d);
        if(user.photoURL != null) {
          if(O.photo) n = '<img width=40px height=40px title=\''+user.displayName+'\' src=\''+user.photoURL+'\' /><br/>';
        } 
            //var uid = user.uid, phoneNumber = user.phoneNumber, providerData = user.providerData;
        var ss =`
          <div class="dropdown" onclick=" $('#LogoutButton').toggle();">
              <button id=dropbtn1 class="dropbtn">${n}</button>
              <div id=LogoutButton class="dropdown-content" >  
                <div class="row"> <div class="column">
                  <a href=#  onclick="SignOut({});">Logout</a>  
                  <a a href=#> Font size 
                    <button  onclick=" $('body *').css('font-size','+=1'); ">+</button>
                    <button  onclick=" $('body *').css('font-size','-=1'); ">-</button>
                  </a>
                </div>  </div>
              </div>
            </div>
            `;

            $('#'+id).html( ss);

       //$('#'+id).html( n +  signout);
      } 
