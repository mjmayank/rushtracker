$(function(){Parse.$=jQuery,Parse.initialize("KyueCTE3edcgkBYXNWK8xUELxvLXdrOR4hoCcbLB","GauBt1jLTOfVaCdzoD3yCe8ZI1AaC3Wec9ekyx7l"),Parse.View.prototype.closeView=function(){this.close&&this.close(),_.each(this.subViews,function(e){e.remove()}),this.remove()};var e=Parse.View.extend({events:{"submit form.login-form":"logIn"},id:"login",initialize:function(){_.bindAll(this,"logIn"),$(".content").html(this.el),console.log("test"),this.render()},logIn:function(e){var t=this,s=this.$("#login-username").val().toLowerCase(),i=this.$("#login-password").val();return Parse.User.logIn(s,i,{success:function(e){b.navigate("/#/rushes")},error:function(e,s){t.$(".login-form .error").html("Invalid username or password. Please try again.").show(),t.$(".login-form button").removeAttr("disabled")}}),this.$(".login-form button").attr("disabled","disabled"),!1},render:function(){this.$el.html(_.template($("#login-template").html())),this.delegateEvents()}}),t=Parse.View.extend({events:{"valid.fndtn.abide":"submit","click #snap":"snap","click #retake":"retake","change #email":"checkIfRegistered"},id:"form",variables:{organization:[],formQuestions:[],orgName:""},initialize:function(e){console.log("initialize register"),$(".content").html(this.el),_.bindAll(this,"render","submit","snap","gumSuccess","gumError","convertCanvasToImage","close","retake","setUpWebcam","saveForm","resetForm","addToEvents"),this.picTaken=null;var t=this;null==e?this.orgid=Parse.User.current().get("organization").id:this.orgid=e;var s=Parse.Object.extend("Organization"),i=new Parse.Query(s);i.get(e).then(function(e){t.variables.organization=e,t.variables.orgName=e.get("name"),t.variables.formQuestions=e.get("formQuestions"),t.render(),$(document).foundation(),t.$("#custom-questions").html(_.template($("#form-custom-questions").html(),t.variables)),t.setUpWebcam()})},setUpWebcam:function(){this.video=document.querySelector("video"),this.canvas=document.getElementById("canvas"),this.context=canvas.getContext("2d"),navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,navigator.getUserMedia&&navigator.getUserMedia({video:!0},this.gumSuccess,this.gumError)},gumSuccess:function(e){"mozSrcObject"in video?(console.log("moz"),video.mozSrcObject=e):window.URL?(console.log("2"),video.src=window.URL.createObjectURL(e)):(console.log("3"),video.src=e),console.log("4"),this.stream=e,video.play()},gumError:function(e){$("#webcam-error").removeClass("hide"),console.error("Error on getUserMedia",e)},formBlur:function(e){this.validate(e.target)},render:function(){this.$el.html(_.template($("#register-form-template").html(),this.variables)),this.delegateEvents()},convertCanvasToImage:function(e){var t=new Image;return t.src=e.toDataURL("image/png"),t.src},retake:function(e){this.$("#canvas-div").addClass("hide"),this.$("#video-div").removeClass("hide")},snap:function(e){this.$("#canvas-div").removeClass("hide"),this.$("#video-div").addClass("hide"),this.context.drawImage(video,0,0,640,480),this.convertCanvasToImage(this.canvas)},checkIfRegistered:function(e){var t=Parse.Object.extend("Form"),s=new Parse.Query(t);s.equalTo("organizations",this.variables.organization),s.equalTo("email",e.target.value);var i=this;s.find({success:function(e){if(console.log(e),0!=e.length){alert("Looks like you've been here. We've added you to today's event");for(var t in e)i.addToEvents(e[t]),i.resetForm()}}})},submit:function(e){if(console.log("submitted"),console.log(e),"abide.fndtn"==e.namespace&&!this.$("#submit").hasClass("disabled")){if(this.$("#canvas-div").hasClass("hide"))return console.log("take a picture!"),void alert("Take a picture");this.$("#submit").addClass("disabled");var t;if(/(Android|iPad|iPhone|iPod)/g.test(navigator.userAgent)){console.log("mobile");var s=document.getElementById("fileInput"),i=s.files[0],n=/image.*/,a=this;if(i.type.match(n)){var r=new FileReader;r.onload=function(e){console.log(r.result),t=new Parse.File("myfile.png",{base64:r.result}),a.saveForm(t)},r.readAsDataURL(i)}}else console.log("desktop"),t=new Parse.File("myfile.png",{base64:this.convertCanvasToImage(this.canvas)}),this.saveForm(t);return!1}},saveForm:function(e){var t=Parse.Object.extend("Form"),s=new t;console.log("file",e);var i=this;e.save().then(function(){console.log("pic saved");var t=document.getElementById("info");console.log("form0"),console.log("form"),s.set("name",t.elements.name.value),console.log("form2"),s.set("email",t.elements.email.value),console.log("form3"),s.set("hometown",t.elements.hometown.value.replace(/,/g,"")),console.log("form4"),s.set("highschool",t.elements.highschool.value.replace(/,/g,"")),s.set("phonenumber",t.elements.phonenumber.value.replace(/\D/g,"")),s.set("residence",t.elements.residence.value.replace(/,/g,"")),s.set("upVote",[]),s.set("downVote",[]),s.set("customQuestions",[]);for(var n in i.variables.formQuestions)s.add("customQuestions",t.elements["custom"+n].value.replace(/,/g,""));s.addUnique("organizations",i.variables.organization),s.set("pic",e),s.save({success:function(e){alert("Submitted!"),i.resetForm(),i.addToEvents(e)},error:function(e,t){alert("Failed to create new object, with error code: "+t.message)}})})},resetForm:function(){var e=document.getElementById("info");e.reset(),this.retake(),this.$("#submit").removeClass("disabled")},addToEvents:function(e){var t=Parse.Object.extend("Event"),s=new Parse.Query(t);s.equalTo("org",this.variables.organization),s.lessThan("start_date",new Date),s.greaterThan("end_date",new Date),s.find({success:function(t){console.log(t);for(var s in t){var i=t[s].relation("attendees");i.add(e),t[s].save()}}})},close:function(){this.stream&&this.stream.stop(),console.log("close form")}}),s=Parse.View.extend({events:{"click #submit":"saveForm"},id:"updateQuestions",variables:{organization:[],formQuestions:[],orgName:""},initialize:function(e){$(".content").html(this.el);var t=this;null==e?this.orgid=Parse.User.current().get("organization").id:this.orgid=e;var s=Parse.Object.extend("Organization"),i=new Parse.Query(s);i.get(e).then(function(e){t.variables.organization=e,t.variables.orgName=e.get("name"),t.variables.formQuestions=e.get("formQuestions"),t.render(),$(document).foundation(),t.$("#custom-questions2").html(_.template($("#update-custom-questions").html(),t.variables))})},render:function(){this.$el.html(_.template($("#update-question-template").html())),this.delegateEvents()},saveForm:function(){this.orgid=Parse.User.current().get("organization").id;var e=Parse.Object.extend("Organization"),t=new Parse.Query(e),s=document.getElementById("newQuestion").value;t.get(this.orgid).then(function(e){""!=s&&(e.addUnique("formQuestions",s),e.save(),location.reload())})}}),i=Parse.View.extend({events:{"submit form.signup-form":"signUp"},id:"org-signup",initialize:function(){$(".content").html(this.el),_.bindAll(this,"signUp"),this.render()},signUp:function(e){console.log("form submitted");var t=this,s=this.$("#signup-frat-name").val(),i=this.$("#signup-name").val(),n=this.$("#signup-email").val(),a=this.$("#signup-username").val().toLowerCase(),r=this.$("#signup-password").val();return Parse.User.signUp(a,r,null,{success:function(e){console.log("signup done");var a=Parse.Object.extend("Organization"),r=new a;r.set("name",s),r.save().then(function(s){console.log("saved",s),e.set("organization",s),e.set("name",i),e.set("email",n),e.save(),b.navigate("/#/rushes"),t.undelegateEvents(),delete t})},error:function(e,s){console.log(s),t.$(".signup-form .error").html(_.escape(s.message)).show(),t.$(".signup-form button").removeAttr("disabled")}}),this.$(".signup-form button").attr("disabled","disabled"),!1},render:function(){this.$el.html(_.template($("#org-signup-template").html())),this.delegateEvents()}}),n=Parse.View.extend({events:{"submit form.signup-form":"signUp"},id:"member-signup",variables:{},initialize:function(e){$(".content").html(this.el),_.bindAll(this,"signUp"),this.orgid=e;var t=Parse.Object.extend("Organization"),s=new Parse.Query(t),i=this;s.get(e).then(function(e){console.log("found org",e),i.variables.org=e,i.variables.orgName=e.get("name"),i.render()})},signUp:function(e){var t=this,s=this.$("#signup-member-name").val(),i=this.$("#signup-email").val(),n=this.$("#signup-username").val().toLowerCase(),a=this.$("#signup-password").val(),r=this.variables.org;return Parse.User.signUp(n,a,null,{success:function(e){console.log("signup done"),e.set("name",s),e.set("email",i),e.set("organization",r),e.save().then(function(e){console.log("saved new member"),b.navigate("/#/rushes"),t.undelegateEvents(),delete t})},error:function(e,s){t.$(".signup-form .error").html(_.escape(s.message)).show(),t.$(".signup-form button").removeAttr("disabled")}}),this.$(".signup-form button").attr("disabled","disabled"),!1},render:function(){this.$el.html(_.template($("#member-signup-template").html(),this.variables)),this.delegateEvents()}}),a=Parse.View.extend({events:{"click #drop":"drop","click #talked":"talked","click #post-comment":"postComment"},id:"profile",initialize:function(e){_.bindAll(this,"talked","postComment","talked","drop"),this.variables={talked:[],previous:"",next:"",comments:[],questions:[]},$(".content").html(this.el),this.rushid=e;var t=Parse.Object.extend("Form"),s=new Parse.Query(t),i=this;s.get(e).then(function(e){i.variables.rushee=e,i.render(),Parse.User.current().get("organization").fetch(function(e){i.variables.questions=e.get("formQuestions"),i.render()});var s=e.get("talked"),n=[];for(var a in s)s[a].fetch({success:function(e){n.push(e),n.length==s.length&&(i.variables.talked=n,i.render())}});var r=new Date(e.createdAt),o=new Parse.Query(t);o.greaterThan("createdAt",r),o.equalTo("organizations",Parse.User.current().get("organization")),o.ascending("createdAt"),o.first(function(e){e&&(i.variables.previous="/#/rushes/"+e.id,i.render())});var l=new Parse.Query(t);l.lessThan("createdAt",r),l.equalTo("organizations",Parse.User.current().get("organization")),l.descending("createdAt"),l.first(function(e){e&&(i.variables.next="/#/rushes/"+e.id,i.render())});var u=Parse.Object.extend("Comment"),c=new Parse.Query(u);c.equalTo("about",e),c.equalTo("org",Parse.User.current().get("organization")),c.descending("createdAt"),c.find(function(e){i.variables.comments=e,i.render()})},function(e,t){console.log("error")})},talked:function(e){this.variables.rushee.addUnique("talked",Parse.User.current()),this.variables.rushee.save();var t=$("#talked");console.log(t),t.addClass("disabled"),t.innerHTML="You've met them",console.log("save")},postComment:function(){if(""===this.$("#comment-textbox")[0].value)return void console.log("do nothing");var e=Parse.Object.extend("Comment"),t=new e;t.set("comment",this.$("#comment-textbox")[0].value),t.set("author",Parse.User.current()),t.set("authorName",Parse.User.current().get("name")),t.set("about",this.variables.rushee),t.set("org",Parse.User.current().get("organization"));var s=this;t.save().then(function(){console.log("saved"),s.$("#comment-textbox")[0].value="",s.variables.comments.push(t),s.render()})},drop:function(e){var t=window.confirm("Are you sure you want to drop him?");t===!0&&(this.variables.rushee.set("status","inactive"),this.variables.rushee.save(),console.log("drop saved"))},render:function(){this.$el.html(_.template($("#rush-profile-template").html(),this.variables)),this.delegateEvents()}}),r=Parse.View.extend({events:{"click .log-out":"logOut","click #download-csv":"downloadCSV","click #loadAll":"loadMore","click #dropped-button":"getDropped","click #active-button":"getActive"},id:"dashboard-view",initialize:function(){_.bindAll(this,"logOut","loadMore","downloadCSV"),$(".content").html(this.el),this.variables={status:"active",array:[]},this.variables.orgid=Parse.User.current().get("organization").id,this.render(),this.subView=new o,this.$("#rush-card-subview").html(this.subView.el);responsiveNav(".nav-collapse");this.getActive()},render:function(){return this.$el.html(_.template($("#dashboard-template").html(),this.variables)),this.delegateEvents(),this},getActive:function(){if(this.$("#dropped-button").addClass("secondary"),this.$("#active-button").removeClass("secondary"),this.variables.active)return this.subView.updateData(this.variables.active),this.variables.active;var e=Parse.Object.extend("Form"),t=new Parse.Query(e);t.notEqualTo("status","inactive");var s=new Parse.Query(e);s.doesNotExist("status");var i=Parse.Query.or(t,s);i.equalTo("organizations",Parse.User.current().get("organization")),i.descending("createdAt"),i.limit(5);var n=this;i.find({success:function(e){n.variables.active=e,n.subView.updateData(e);for(obj in e){var t=e[obj].get("status");if(null==t||"inactive"!=t){var s={};s.name=e[obj].get("name"),s.id=e[obj].id,s.email=e[obj].get("email"),s.hometown=e[obj].get("hometown"),s.highschool=e[obj].get("highschool"),s.phonenumber=e[obj].get("phonenumber"),10==s.phonenumber.length&&(s.phonenumber=["(",s.phonenumber.slice(0,3),")",s.phonenumber.slice(3,6),"-",s.phonenumber.slice(6)].join("")),s.residence=e[obj].get("residence"),s.fileurl=e[obj].get("pic").url(),n.variables.array.push(s)}}return e},error:function(e,t){return console.log("error"),[]}})},getDropped:function(){if(this.$("#dropped-button").removeClass("secondary"),this.$("#active-button").addClass("secondary"),this.variables.inactive)return this.subView.updateData(this.variables.inactive),this.variables.inactive;var e=Parse.Object.extend("Form"),t=new Parse.Query(e);t.equalTo("status","inactive"),t.equalTo("organizations",Parse.User.current().get("organization")),t.descending("createdAt"),t.limit(5);var s=this;t.find({success:function(e){s.variables.inactive=e,s.subView.updateData(e)},error:function(e,t){console.log("error")}})},loadMore:function(e){console.log(e.target),this.$("#loadAll").addClass("hide"),console.log("loadmore");var t=Parse.Object.extend("Form"),s=new Parse.Query(t);s.notEqualTo("status","inactive");var i=new Parse.Query(t);i.doesNotExist("status");var n=Parse.Query.or(s,i);n.equalTo("organizations",Parse.User.current().get("organization")),n.descending("createdAt"),n.skip(5),n.limit(1e3);var a=this;n.find({success:function(e){a.variables.active=a.variables.active.concat(e),a.subView.updateData(a.variables.active)},error:function(e,t){console.log("error")}})},downloadCSV:function(){console.log(this.variables.array);var e=[];for(var t in this.variables.array){var s=[];for(var i in this.variables.array[t])s.push(this.variables.array[t][i]);console.log(s),e.push(s)}console.log(e);var n="data:text/csv;charset=utf-8,";e.forEach(function(e,t){dataString=e.join(","),n+=dataString+"\n"});var a=encodeURI(n);window.open(a)},logOut:function(e){Parse.User.logOut(),b.navigate("/#/login"),this.undelegateEvents(),delete this}}),o=Parse.View.extend({id:"rush-card-list",initialize:function(e){_.bindAll(this,"close","updateData"),this.variables={data:e},console.log("initialize rushes"),this.render()},updateData:function(e){this.variables.data=e,this.render()},render:function(){var e=this.variables.data;return this.$el.html(_.template($("#rush-list-template").html(),this.variables)),this.delegateEvents(),_.each(e,function(e){var t=new l(e);this.$("#"+e.id).html(t.el)}),this},close:function(){console.log("close rushes")}}),l=Parse.View.extend({events:{"click #drop":"drop","click #talked":"talked","click .upvote":"upVote","click .downvote":"downVote"},id:"rush-card",initialize:function(e){_.bindAll(this,"drop","talked"),this.variables={},this.variables.rushee=e,this.variables.upVotes=e.get("upVote")?e.get("upVote").length:"0",this.variables.downVotes=e.get("upVote")?e.get("downVote").length:"0";var t=Parse.Object.extend("Comment"),s=new Parse.Query(t);s.equalTo("about",e),s.equalTo("org",Parse.User.current().get("organization")),s.descending("createdAt");var i=this;s.first(function(e){i.variables.comment=e,i.render()})},drop:function(e){var t=window.confirm("Are you sure you want to drop him?");t===!0&&(this.variables.rushee.set("status","inactive"),this.variables.rushee.save(),console.log("drop saved"))},talked:function(e){this.variables.rushee.addUnique("talked",Parse.User.current()),this.variables.rushee.save();var t=$("#talked");console.log(t),t.addClass("disabled"),t[0].innerHTML="You've met them",console.log("met saved")},upVote:function(){this.variables.rushee.remove("downVote",Parse.User.current()),this.variables.rushee.addUnique("upVote",Parse.User.current());var e=this;this.variables.rushee.save().then(function(){e.variables.upVotes=e.variables.rushee.get("upVote").length,e.variables.downVotes=e.variables.rushee.get("downVote").length,e.render(),console.log("upvoted")})},downVote:function(){this.variables.rushee.remove("upVote",Parse.User.current()),this.variables.rushee.addUnique("downVote",Parse.User.current());var e=this;this.variables.rushee.save().then(function(){e.variables.upVotes=e.variables.rushee.get("upVote").length,e.variables.downVotes=e.variables.rushee.get("downVote").length,e.render(),console.log("downvoted")})},render:function(e){return this.$el.html(_.template($("#rush-card-template").html(),this.variables)),this.delegateEvents(),$(document).foundation("equalizer","reflow"),this}}),u=Parse.View.extend({events:{"click #submit":"submitPressed"},id:"create-event-view",initialize:function(){$(".content").html(this.el),console.log(this.el),this.variables={},this.render(),console.log("create event view")},submitPressed:function(){console.log(this.$("#create-event-date")[0].value);var e=new Date;console.log(e.getTimezoneOffset());var t=Parse.Object.extend("Event"),s=new t;s.set("title",this.$("#create-event-name")[0].value);var i=new Date(this.$("#create-event-date")[0].value);i.setTime(i.getTime()+60*e.getTimezoneOffset()*1e3);var n=new Date(this.$("#create-event-end-date")[0].value);return n.setTime(n.getTime()+60*e.getTimezoneOffset()*1e3),s.set("start_date",i),s.set("end_date",n),s.set("org",Parse.User.current().get("organization")),s.save().then(function(){console.log("saved"),b.navigate("/#/events")}),!1},render:function(){return console.log("test"),this.$el.html(_.template($("#create-event-template").html(),this.variables)),this.delegateEvents(),this}}),c=Parse.View.extend({events:{},id:"event-view",initialize:function(){$(".content").html(this.el),this.variables={status:"active",array:[]},this.render(),this.subView=new d,this.$("#event-card-subview").html(this.subView.el),this.queryEvents()},queryEvents:function(){var e=Parse.Object.extend("Event"),t=new Parse.Query(e);t.equalTo("org",Parse.User.current().get("organization")),t.descending("createdAt"),t.limit(5);var s=this;t.find({success:function(e){console.log(e),s.subView.updateData(e);for(obj in e){var t=e[obj].get("status");if(null==t||"inactive"!=t){var i={};i.title=e[obj].get("title"),i.id=e[obj].id,i.start_date=e[obj].get("start_date"),s.variables.array.push(i)}}return e},error:function(e,t){return console.log("error"),[]}})},render:function(){return console.log("test"),this.$el.html(_.template($("#event-template").html(),this.variables)),this.delegateEvents(),this}}),d=Parse.View.extend({events:{},id:"event-list-view",initialize:function(){this.variables={data:[]},this.render()},updateData:function(e){this.variables.data=e,this.render()},render:function(){var e=this.variables.data;return console.log("test list view"),this.$el.html(_.template($("#event-list-template").html(),this.variables)),this.delegateEvents(),_.each(e,function(e){var t=new h(e);this.$("#"+e.id).html(t.el)}),this}}),h=Parse.View.extend({events:{},id:"event-card-view",initialize:function(e){this.variables={data:[]},this.variables.event=e,this.render()},render:function(){return console.log("test list view"),this.$el.html(_.template($("#event-card-template").html(),this.variables)),this.delegateEvents(),this}}),v=Parse.View.extend({events:{},id:"event-profile-view",initialize:function(e){$(".content").html(this.el),this.variables={data:[]},this.render(),this.queryAttendees(e),this.subView=new o,this.$("#rush-list-subview").html(this.subView.el)},render:function(){return console.log("test list view"),this.$el.html(_.template($("#event-profile-template").html(),this.variables)),this.delegateEvents(),this},queryAttendees:function(e){var t=Parse.Object.extend("Event"),s=new Parse.Query(t),i=this;s.get(e,{success:function(e){var t=e.relation("attendees"),s=t.query();s.find({success:function(e){console.log(e),i.subView.updateData(e)}})},error:function(e,t){return console.log("error"),[]}})}}),g=Parse.View.extend({events:{},id:"event-profile-view",initialize:function(e){$(".content").html(this.el),this.variables={data:[]},this.render(),this.queryAttendees(e)},render:function(){return console.log("test list view"),this.$el.html(_.template($("#event-profile-template").html(),this.variables)),this.delegateEvents(),this},queryAttendees:function(e){var t=Parse.Object.extend("Event"),s=new Parse.Query(t);s.get(e,{success:function(e){var t=e.relation("attendees"),s=t.query();s.find({success:function(e){console.log(e)}})},error:function(e,t){return console.log("error"),[]}})}}),m=Parse.View.extend({events:{},id:"settings-view",initialize:function(){$(".content").html(this.el),this.variables={};var e=this;this.variables.orgid=Parse.User.current().get("organization").fetch(function(t){e.variables.organization=t,e.render()})},render:function(){return this.$el.html(_.template($("#settings-template").html(),this.variables)),this.delegateEvents(),this}}),f=Parse.Router.extend({routes:{form:"form","form/:orgid":"orgForm","update/:orgid":"updateQuestions",signup:"orgSignup","signup/:orgid":"memberSignup",rushes:"rushes","rushes/:rushid":"profile",login:"rushes",settings:"settings",events:"events","events/create":"createEvent","events/:eventid":"eventProfile","events/:eventid/form":"eventForm","*path":"homepage"},initialize:function(e){console.log("initialize")},homepage:function(){$(".content").html(_.template($("#homepage-template").html()))},form:function(){console.log("register"),this.checkCurrentUser()?this.loadView(new t):(console.log("initialize",this.view),this.loadView(new e))},events:function(){console.log("events"),this.checkCurrentUser()?this.loadView(new c):this.loadView(new e)},createEvent:function(){console.log("createEvent"),this.checkCurrentUser()?this.loadView(new u):this.loadView(new e)},eventProfile:function(t){console.log("eventProfile"),this.checkCurrentUser()?this.loadView(new v(t)):this.loadView(new e)},eventForm:function(e){console.log("eventForm"),this.loadView(new g(e))},orgForm:function(e){console.log("orgForm"),this.loadView(new t(e))},updateQuestions:function(e){console.log("update questions form"),this.loadView(new s(e))},orgSignup:function(){console.log("org signup"),this.loadView(new i)},memberSignup:function(e){console.log("member signup"),this.loadView(new n(e))},rushes:function(){this.checkCurrentUser()?(console.log("rushes"),this.loadView(new r)):(console.log("login"),this.loadView(new e))},profile:function(t){this.checkCurrentUser()?(console.log("profile"),this.loadView(new a(t))):this.loadView(new e)},settings:function(){this.checkCurrentUser()?(console.log("profile"),this.loadView(new m)):this.loadView(new e)},checkCurrentUser:function(){return Parse.User.current()?(Parse.User.current().fetch(),!0):!1},loadView:function(e){this.view&&(this.view.closeView?this.view.closeView():this.view.remove()),this.view=e}}),b=new f;Parse.history.start()});