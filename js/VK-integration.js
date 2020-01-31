// class VK_SGFX {
//     constructor() {
//         //TODO: revisit the whole auth thing
//         // as it turns out browser does not forget the login state after page refresh
//         // it keeps you logged in, tho it does forget the .user object from session
//         // expire and ids are all still there, gotta do something with them instead of .user
//         // dunno how to check for isFrupMember in that case tho :(
//
//         VK.init({
//             apiId: 7123145
//         });
//
//         this.isAuthorised = false;
//         this.isFrupMember = false;
//
//         this.checkStatus();
//     }
//
//     checkStatus() {
//         VK.Auth.getLoginStatus(status => {
//             if (status.status === 'connected') {
//
//             }
//         });
//         if (VK.Auth.getSession() !== null && VK.Auth.getSession().user !== undefined) {
//             this.isAuthorised = true;
//
//             $.ajax({
//                 type: "POST",
//                 url: "handlers/login.php",
//                 data: {
//                     domain: VK.Auth.getSession().user.domain
//                 },
//                 success: (result) => {
//                     this.isFrupMember = result === 'SUCCESS';
//                 }
//             });
//         } else {
//             this.isAuthorised = false;
//             this.isFrupMember = false;
//         }
//         this.renderHeaderLogin();
//     }
//
//     renderHeaderLogin() {
//         let h = document.getElementById("header-login");
//         h.innerHTML = '';
//         h.appendChild(this.generateHeaderLogin());
//     }
//
//     generateHeaderLogin() {
//         let b = document.createElement('button');
//
//         if (this.isAuthorised) {
//             b.innerText = 'Выход';
//             b.addEventListener('click',() => {
//                 VK.Auth.logout(() => {
//                     this.checkStatus();
//                 });
//             })
//         } else {
//             b.innerText = 'Вход';
//             b.addEventListener('click',() => {
//                 VK.Auth.login(() => {
//                     this.checkStatus();
//                 });
//             })
//         }
//
//         return b;
//     }
// }