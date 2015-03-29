$(function() {

    Parse.$ = jQuery;

    // Initialize Parse with your Parse application javascript keys
    Parse.initialize("KyueCTE3edcgkBYXNWK8xUELxvLXdrOR4hoCcbLB",
        "GauBt1jLTOfVaCdzoD3yCe8ZI1AaC3Wec9ekyx7l");

    // The Application
    // ---------------
    Parse.View.prototype.closeView = function(){
        this.close && this.close();
        _.each(this.subViews, function(view) {
            view.remove();
        });
        this.remove();
    }


    var LogInView = Parse.View.extend({
        events: {
            "submit form.login-form": "logIn",
        },

        id: "login",

        initialize: function() {
            _.bindAll(this, "logIn");
            $(".content").html(this.el);
            console.log("test");
            this.render();
        },

        logIn: function(e) {
            var self = this;
            var username = this.$("#login-username").val();
            var password = this.$("#login-password").val();

            Parse.User.logIn(username, password, {
                success: function(user) {
                    router.rushes();
                    // new RegisterFormView();
                    // self.undelegateEvents();
                    // delete self;
                },

                error: function(user, error) {
                    self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
                    self.$(".login-form button").removeAttr("disabled");
                }
            });

            this.$(".login-form button").attr("disabled", "disabled");

            return false;
        },

        render: function() {
            this.$el.html(_.template($("#login-template").html()));
            this.delegateEvents();
        },

    });

    // The form view that lets a user manage their todo items
    var RegisterFormView = Parse.View.extend({

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "valid.fndtn.abide": "submit",
            "click #snap": "snap",
            "click #retake": "retake",
            // "blur input": "formBlur"
        },

        id: "form",

        variables: {
            "organization": [],
            "formQuestions": [],
            "orgName": ""
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved to Parse.
        initialize: function(orgid) {
            console.log("initialize register");
            $(".content").html(this.el);
            _.bindAll(this, 'render', 'submit', 'snap', 'gumSuccess', 'gumError', 'convertCanvasToImage', "close", "retake", "setUpWebcam", "saveForm");

            // Main todo management template

            this.picTaken = null;
            var that = this;

            if (orgid == null) {
                this.orgid = Parse.User.current().get("organization").id
            } else {
                this.orgid = orgid;
            }
            var org = Parse.Object.extend("Organization");
            var query = new Parse.Query(org);
            query.get(orgid).then(function(myObj) {
                that.variables["organization"] = myObj;
                that.variables["orgName"] = myObj.get("name");
                that.variables["formQuestions"] = myObj.get("formQuestions");
                that.render();
                $(document).foundation();
                that.$("#custom-questions").html(_.template($("#form-custom-questions").html(), that.variables));
                // if(!/(iPad|iPhone|iPod)/g.test( navigator.userAgent )){
                    that.setUpWebcam();
                // }
            });
        },

        setUpWebcam: function(){
            this.video = document.querySelector('video');
            this.canvas = document.getElementById("canvas"),
                this.context = canvas.getContext("2d");

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: true
                }, this.gumSuccess, this.gumError);
            }
        },

        gumSuccess: function(stream) {
            // window.stream = stream;
            if ('mozSrcObject' in video) {
                console.log("1");
                video.mozSrcObject = stream;
            } else if (window.webkitURL) {
                console.log("2");
                video.src = window.webkitURL.createObjectURL(stream);
            } else {
                console.log("3");
                video.src = stream;
            }
            console.log("4");
            this.stream = stream;
            video.play();
        },

        gumError: function(error) {
            console.error('Error on getUserMedia', error);
        },

        formBlur: function(e) {
            this.validate(e.target)
        },

        render: function() {
            this.$el.html(_.template($("#register-form-template").html(), this.variables));
            this.delegateEvents();
        },

        convertCanvasToImage: function(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image.src;
        },

        retake: function(e) {
            this.$('#canvas-div').addClass("hide");
            this.$('#video-div').removeClass("hide");
        },

        snap: function(e) {
            this.$('#canvas-div').removeClass("hide");
            this.$('#video-div').addClass("hide");
            this.context.drawImage(video, 0, 0, 640, 480);
            this.convertCanvasToImage(this.canvas);
        },

        submit: function(e) {
            console.log("submitted");
            console.log(e);
            // this.validateForm();
            if (e.namespace != 'abide.fndtn') {
                return;
            }

            if (this.$('#submit').hasClass("disabled")) {
                return;
            }

            if (this.$('#canvas-div').hasClass("hide")) {
                console.log("take a picture!");
                alert("Take a picture");
                return;
            }

            this.$('#submit').addClass("disabled");

            var file;


            // if(/(iPad|iPhone|iPod)/g.test( navigator.userAgent )){
            //     console.log("iphone");
            //     var reader = new FileReader();

            //     reader.onloadend = function () {
            //         console.log("test");
            //         file = new Parse.File("myfile.png", {
            //             base64: reader.result
            //         });
            //         this.saveForm(file);
            //     }
            // } else{
                console.log("desktop");
                file = new Parse.File("myfile.png", {
                    base64: this.convertCanvasToImage(this.canvas)
                });
                this.saveForm(file);
            // }
        },

        saveForm: function(file) {
                var formObj = Parse.Object.extend("Form");
                var form = new formObj();
                console.log("file", file);
                var that = this;
                file.save().then(function() {
                    console.log("pic saved");
                    var formdata = document.getElementById("info");
                    console.log("form0");
                    console.log("form");
                    form.set("name", formdata.elements["name"].value);
                    console.log("form2");
                    form.set("email", formdata.elements["email"].value);
                    console.log("form3");
                    form.set("hometown", formdata.elements["hometown"].value.replace(/,/g, ''));
                    console.log("form4");
                    form.set("highschool", formdata.elements["highschool"].value.replace(/,/g, ''));
                    form.set("phonenumber", formdata.elements["phonenumber"].value.replace(/\D/g, ''));
                    form.set("residence", formdata.elements["residence"].value.replace(/,/g, ''));
                    form.set("upVote", []);
                    form.set("downVote", []);
                    for (var q in that.variables["formQuestions"]) {
                        form.add("customQuestions", formdata.elements["custom" + q].value.replace(/,/g, ''));
                    }
                    form.addUnique("organizations", that.variables["organization"]);
                    form.set("pic", file);
                    form.save( {
                        success: function(form) {
                            // Execute any logic that should take place after the object is saved.
                            alert('Submitted!');
                            formdata.reset();
                            that.retake();
                            that.$('#submit').removeClass("disabled");
                        },
                        error: function(form, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            alert('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                });
        },

        close: function() {
            this.stream && this.stream.stop();
            console.log("close form");
        }

    });

    // This view allows a member to customize their org's form questions.
    var updateQuestionsView = Parse.View.extend({
        events: {
            "click #submit": "saveForm"
        },

        id: "updateQuestions",

        variables: {
            "organization": [],
            "formQuestions": [],
            "orgName": ""
        },

        initialize: function(orgid){

            $(".content").html(this.el);
            var that = this;

            if (orgid == null) {
                this.orgid = Parse.User.current().get("organization").id;
            } else {
                this.orgid = orgid;
            }

            var org = Parse.Object.extend("Organization");
            var query = new Parse.Query(org);

            query.get(orgid).then(function(myObj) {
                that.variables["organization"] = myObj;
                that.variables["orgName"] = myObj.get("name");
                that.variables["formQuestions"] = myObj.get("formQuestions");
                that.render();

                $(document).foundation();
                that.$("#custom-questions2").html(_.template($("#form-custom-questions").html(), that.variables));
            });
        },

        render: function(){
            this.$el.html(_.template($("#update-question-template").html()));
            this.delegateEvents();
        },

        saveForm: function(){
            this.orgid = Parse.User.current().get("organization").id;

            var org = Parse.Object.extend("Organization");
            var query = new Parse.Query(org);

            var newQText = document.getElementById("newQuestion").value;

            query.get(this.orgid).then(function(myObj) {
                if (newQText != ""){ // don't add empty string as a question.
                    myObj.addUnique("formQuestions", newQText);
                    myObj.save();
                    location.reload();
                }
            });
        }
    });

    var orgSignupView = Parse.View.extend({
        events: {
            "submit form.signup-form": "signUp"
        },

        id: "org-signup",

        initialize: function() {
            $(".content").html(this.el);
            _.bindAll(this, "signUp");
            this.render();
        },

        signUp: function(e) {
            console.log("form submitted");
            var self = this;
            var org = this.$("#signup-frat-name").val();
            var name = this.$("#signup-name").val();
            var username = this.$("#signup-username").val();
            var password = this.$("#signup-password").val();

            Parse.User.signUp(username, password, null, {
                success: function(user) {
                    console.log("signup done");
                    var orgObj = Parse.Object.extend("Organization");
                    var obj = new orgObj();
                    obj.set("name", org);
                    obj.save().then(function(myObj) {
                        console.log("saved", myObj);
                        user.set("organization", myObj);
                        user.set("name", name);
                        user.save();
                        new RegisterFormView();
                        self.undelegateEvents();
                        delete self;
                    });
                },

                error: function(user, error) {
                    console.log(error);
                    self.$(".signup-form .error").html(_.escape(error.message)).show();
                    self.$(".signup-form button").removeAttr("disabled");
                }
            });

            this.$(".signup-form button").attr("disabled", "disabled");

            return false;
        },

        render: function() {
            this.$el.html(_.template($("#org-signup-template").html()));
            this.delegateEvents();
        },

    });

    var memberSignupView = Parse.View.extend({
        events: {
            "submit form.signup-form": "signUp"
        },

        id: "member-signup",

        variables: {

        },

        initialize: function(orgid) {
            $(".content").html(this.el);
            _.bindAll(this, "signUp");

            this.orgid = orgid;
            var org = Parse.Object.extend("Organization");
            var query = new Parse.Query(org);
            var that = this;
            query.get(orgid).then(function(myObj) {
                console.log("found org", myObj);
                that.variables["org"] = myObj;
                that.variables["orgName"] = myObj.get("name");
                that.render();
            });
        },

        signUp: function(e) {
            var self = this;
            var name = this.$("#signup-member-name").val();
            var username = this.$("#signup-username").val();
            var password = this.$("#signup-password").val();
            var org = this.variables["org"];

            Parse.User.signUp(username, password, {
                ACL: new Parse.ACL()
            }, {
                success: function(user) {
                    console.log("signup done");
                    user.set("name", name);
                    user.set("organization", org);
                    user.save().then(function(myObj) {
                        console.log("saved new member");
                        new DashboardView();
                        self.undelegateEvents();
                        delete self;
                    });
                },

                error: function(user, error) {
                    self.$(".signup-form .error").html(_.escape(error.message)).show();
                    self.$(".signup-form button").removeAttr("disabled");
                }
            });

            this.$(".signup-form button").attr("disabled", "disabled");

            return false;
        },

        render: function() {
            this.$el.html(_.template($("#member-signup-template").html(), this.variables));
            this.delegateEvents();
        },

    });

    var ProfileView = Parse.View.extend({
        events: {
            "click #drop": "drop",
            "click #talked": "talked",
            "click #post-comment": "postComment"
        },

        id: "profile",

        initialize: function(rushid) {
            _.bindAll(this, "talked", "postComment", "talked", "drop");
            this.variables = {
                                "talked": [],
                                "previous": "",
                                "next": "",
                                "comments": [],
                                "questions": []
                            },
            $(".content").html(this.el);

            this.rushid = rushid;
            var form = Parse.Object.extend("Form");
            var query = new Parse.Query(form);
            var that = this;
            query.get(rushid).then(
                function(rushee) {
                    // The object was retrieved successfully.
                    that.variables["rushee"] = rushee;
                    that.render();

                    Parse.User.current().get("organization").fetch(
                        function(myObj){
                            that.variables["questions"] = myObj.get("formQuestions");
                            that.render();
                    });

                    var talkedarr = rushee.get("talked");
                    var temptalked = [];
                    for (var member in talkedarr) {
                        talkedarr[member].fetch({
                            success: function(myObj) {
                                temptalked.push(myObj);
                                if (temptalked.length == talkedarr.length) {
                                    that.variables["talked"] = temptalked;
                                    that.render();
                                }
                            }
                        });
                    }

                    var date = new Date(rushee.createdAt);
                    var nextQuery = new Parse.Query(form);
                    nextQuery.greaterThan("createdAt", date);
                    nextQuery.equalTo("organizations", Parse.User.current().get("organization"));
                    nextQuery.ascending("createdAt");
                    nextQuery.first(
                        function(myObj) {
                            if (myObj) {
                                // The object was retrieved successfully.
                                that.variables["previous"] = "/#/rushes/" + myObj.id;
                                that.render();
                            }
                        });

                    var prevQuery = new Parse.Query(form);
                    prevQuery.lessThan("createdAt", date);
                    prevQuery.equalTo("organizations", Parse.User.current().get("organization"));
                    prevQuery.descending("createdAt");
                    prevQuery.first(
                        function(myObj) {
                            if (myObj) {
                                // The object was retrieved successfully.
                                that.variables["next"] = "/#/rushes/" + myObj.id;
                                that.render();
                            }
                        });

                    var comment = Parse.Object.extend("Comment");
                    var commentsQuery = new Parse.Query(comment);
                    commentsQuery.equalTo("about", rushee);
                    commentsQuery.equalTo("org", Parse.User.current().get("organization"));
                    commentsQuery.descending("createdAt");
                    commentsQuery.find(
                        function(array) {
                            that.variables["comments"] = array;
                            that.render();
                        });
                },
                function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    console.log("error");
                }
            );
        },

        talked: function(e) {
            this.variables["rushee"].addUnique("talked", Parse.User.current());
            this.variables["rushee"].save();
            console.log("save");
        },

        postComment: function() {
            if (this.$("#comment-textbox")[0].value === "") {
                console.log("do nothing");
                return;
            }
            var comment = Parse.Object.extend("Comment");
            var obj = new comment();
            obj.set("comment", this.$("#comment-textbox")[0].value);
            obj.set("author", Parse.User.current());
            obj.set("authorName", Parse.User.current().get("name"));
            obj.set("about", this.variables["rushee"]);
            obj.set("org", Parse.User.current().get("organization"));
            var that = this;
            obj.save().then(function() {
                console.log("saved");
                that.$("#comment-textbox")[0].value = "";
                that.variables["comments"].push(obj);
                that.render();
            });
        },

        drop: function(e) {
            var confirm = window.confirm("Are you sure you want to drop him?");
            if (confirm == true) {
                this.variables["rushee"].set("status", "inactive");
                this.variables["rushee"].save();
                console.log("drop saved");
            }
        },

        render: function() {
            this.$el.html(_.template($("#rush-profile-template").html(), this.variables));
            this.delegateEvents();
        },

    });

    var RushCardListView = Parse.View.extend({

        id: "rush-card-list",

        initialize: function(array) {
            _.bindAll(this, "close");
            this.variables = {
                                "array": [],
                                "data": []
                            }
            console.log("initialize rushes");
            this.render(array);
        },

        render: function(array) {
            this.$el.html(_.template($("#rush-list-template").html(), {
                "data": array
            }));
            this.delegateEvents();

            _.each(array, function(rushee) {
                var rushCard = new RushCardView(rushee);
                this.$('#' + rushee.id).html(rushCard.el);
            });

            return this;
        },

        close: function() {
            console.log("close rushes");
        }

    });

    var RushCardView = Parse.View.extend({
        events: {
            "click #drop": "drop",
            "click #talked": "talked",
            "click .upvote": "upVote",
            "click .downvote": "downVote"
        },

        id: "rush-card",

        initialize: function(rush) {
            _.bindAll(this, "drop", "talked")
            this.variables = {};
            this.variables["rushee"] = rush;
            this.variables["upVotes"] = rush.get("upVote") ? rush.get("upVote").length : "0";
            this.variables["downVotes"] = rush.get("upVote") ? rush.get("downVote").length : "0";
            var comment = Parse.Object.extend("Comment");
            var commentsQuery = new Parse.Query(comment);
            commentsQuery.equalTo("about", rush);
            commentsQuery.equalTo("org", Parse.User.current().get("organization"));
            commentsQuery.descending("createdAt");
            var that = this
            commentsQuery.first(
                function(myObj) {
                    // console.log(myObj);
                    that.variables["comment"] = myObj;
                    that.render();
                });
        },

        drop: function(e) {
            var confirm = window.confirm("Are you sure you want to drop him?");
            if (confirm == true) {
                this.variables["rushee"].set("status", "inactive");
                this.variables["rushee"].save();
                console.log("drop saved");
            }
        },

        talked: function(e) {
            this.variables["rushee"].addUnique("talked", Parse.User.current());
            this.variables["rushee"].save();
            console.log("met saved");
        },

        upVote: function(){
            this.variables["rushee"].remove("downVote", Parse.User.current());
            this.variables["rushee"].addUnique("upVote", Parse.User.current());
            var that = this;
            this.variables["rushee"].save().then(function(){
                that.variables["upVotes"] = that.variables["rushee"].get("upVote").length;
                that.variables["downVotes"] = that.variables["rushee"].get("downVote").length;
                that.render();
                console.log("upvoted");
            });
        },

        downVote: function(){
            this.variables["rushee"].remove("upVote", Parse.User.current());
            this.variables["rushee"].addUnique("downVote", Parse.User.current());
            var that = this;
            this.variables["rushee"].save().then(function(){
                that.variables["upVotes"] = that.variables["rushee"].get("upVote").length;
                that.variables["downVotes"] = that.variables["rushee"].get("downVote").length;
                that.render();
                console.log("downvoted");
            });
        },

        render: function(array) {
            this.$el.html(_.template($("#rush-card-template").html(), this.variables));
            this.delegateEvents();

            $(document).foundation('equalizer', 'reflow');
            return this;
        }

    })

    var SettingsView = Parse.View.extend({
        events: {

        },

        id: "settings-view",

        initialize: function() {
            $(".content").html(this.el);
            this.variables = {}
            var that = this;
            this.variables["orgid"] = Parse.User.current().get("organization").fetch(
                function(myObj){
                    that.variables["organization"] = myObj;
                    that.render();
            });
        },

        render: function(){
            this.$el.html(_.template($("#settings-template").html(), this.variables));
            this.delegateEvents();
            return this;
        },
    })

    var DashboardView = Parse.View.extend({
        events: {
            "click .log-out": "logOut",
            "click #download-csv": "downloadCSV",
            "click #loadAll": "loadMore",
            "click #dropped-button": "getDropped",
            "click #active-button": "getActive",
        },

        id: "dashboard-view",

        initialize: function() {
            _.bindAll(this, "logOut", "loadMore", "downloadCSV");
            $(".content").html(this.el);
            this.variables = {
                                "status": "active",
                                "array": []
                            },
            this.variables["orgid"] = Parse.User.current().get("organization").id;

            this.render();
            this.subView = new RushCardListView();
            this.$('#rush-card-subview').html(this.subView.el);

            var nav = responsiveNav(".nav-collapse");

            var test = this.getActive();
        },

        getActive: function() {
            if (this.variables["active"]) {
                this.subView.render(this.variables["active"]);
                return this.variables["active"];
            } else {
                var form = Parse.Object.extend("Form");

                var notInactiveQuery = new Parse.Query(form);
                notInactiveQuery.notEqualTo("status", "inactive");

                var notNullQuery = new Parse.Query(form);
                notNullQuery.doesNotExist("status");

                var query = Parse.Query.or(notInactiveQuery, notNullQuery);
                // var query = new Parse.Query(form);
                query.equalTo("organizations", Parse.User.current().get("organization"));
                query.descending("createdAt");
                query.limit(5);
                var that = this;
                query.find({
                    success: function(array) {
                        // The object was retrieved successfully.
                        that.variables["active"] = array;
                        that.subView.render(array);
                        for (obj in array) {
                            // console.log(array[obj].get('talked'));
                            var status = array[obj].get("status");
                            if (status == null || status != "inactive") {
                                var dict = {};
                                dict["name"] = array[obj].get("name");
                                dict["id"] = array[obj].id;
                                dict["email"] = array[obj].get("email");
                                dict["hometown"] = array[obj].get("hometown");
                                dict["highschool"] = array[obj].get("highschool");
                                dict["phonenumber"] = array[obj].get("phonenumber");
                                if (dict["phonenumber"].length == 10) {
                                    dict["phonenumber"] = ["(", dict["phonenumber"].slice(0, 3), ")", dict["phonenumber"].slice(3, 6), "-", dict["phonenumber"].slice(6)].join('');
                                }
                                dict["residence"] = array[obj].get("residence");
                                dict["fileurl"] = array[obj].get("pic").url();
                                that.variables["array"].push(dict);
                            }
                        }
                        return array;
                    },
                    error: function(object, error) {
                        // The object was not retrieved successfully.
                        // error is a Parse.Error with an error code and message.
                        console.log("error");
                        return [];
                    }
                });
            }
        },

        getDropped: function() {
            if (this.variables["inactive"]) {
                this.subView.render(this.variables["inactive"]);
            } else {
                var form = Parse.Object.extend("Form");

                var query = new Parse.Query(form);
                query.equalTo("status", "inactive");
                query.equalTo("organizations", Parse.User.current().get("organization"));
                query.descending("createdAt");
                query.limit(5);
                var that = this;
                query.find({
                    success: function(array) {
                        // The object was retrieved successfully.
                        that.variables["inactive"] = array;
                        // that.render(that.variables);
                        that.subView.render(array);
                    },
                    error: function(object, error) {
                        // The object was not retrieved successfully.
                        // error is a Parse.Error with an error code and message.
                        console.log("error");
                    }
                });
            }
        },

        loadMore: function(e) {
            console.log(e.target);
            this.$('#loadAll').addClass("hide");
            console.log("loadmore");

            var form = Parse.Object.extend("Form");

            var notInactiveQuery = new Parse.Query(form);
            notInactiveQuery.notEqualTo("status", "inactive");

            var notNullQuery = new Parse.Query(form);
            notNullQuery.doesNotExist("status");

            var query = Parse.Query.or(notInactiveQuery, notNullQuery);
            // var query = new Parse.Query(form);
            query.equalTo("organizations", Parse.User.current().get("organization"));
            query.descending("createdAt");
            query.skip(5);
            query.limit(1000);
            var that = this;
            query.find({
                success: function(array) {
                    // The object was retrieved successfully.
                    that.variables["active"] = that.variables["active"].concat(array);
                    that.subView.render(that.variables["active"]);
                },
                error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    console.log("error");
                }
            });
        },

        downloadCSV: function() {
            console.log(this.variables["array"]);
            var data = [];
            for (var rushee in this.variables["array"]) {
                var sing_val = []
                for (var key in this.variables["array"][rushee]) {
                    sing_val.push(this.variables["array"][rushee][key]);
                }
                console.log(sing_val);
                data.push(sing_val);
            }

            console.log(data);

            // var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
            var csvContent = "data:text/csv;charset=utf-8,";
            data.forEach(function(infoArray, index) {
                dataString = infoArray.join(",");
                csvContent += dataString + "\n";
            });

            var encodedUri = encodeURI(csvContent);
            window.open(encodedUri);
        },

        // Logs out the user and shows the login view
        logOut: function(e) {
            Parse.User.logOut();
            new LogInView();
            this.undelegateEvents();
            delete this;
        },

        render: function() {
            this.$el.html(_.template($("#dashboard-template").html(), this.variables));
            this.delegateEvents();
            return this;
        }
    })

    var AppRouter = Parse.Router.extend({
        routes: {
            "form": "form",
            "form/:orgid": "orgForm",

            "update/:orgid": "updateQuestions",

            "signup": "orgSignup",
            "signup/:orgid": "memberSignup",

            "rushes": "rushes",
            "rushes/:rushid": "profile",

            "login": "rushes",

            "settings": "settings",

            "*path": "homepage"
        },

        initialize: function(options) {
            console.log("initialize");
        },

        homepage: function(){
            $(".content").html(_.template($("#homepage-template").html()));
        },

        form: function() {
            console.log("register");
            if (!this.checkCurrentUser()) {
                console.log("initialize", this.view);
                this.loadView(new LogInView());
            } else {
                this.loadView(new RegisterFormView());
            }
        },

        orgForm: function(orgid) {
            console.log("orgForm");
            this.loadView(new RegisterFormView(orgid));
        },

        updateQuestions: function(orgid){
            console.log('update questions form');
            this.loadView(new updateQuestionsView(orgid));
        },

        orgSignup: function() {
            console.log("org signup");
            this.loadView(new orgSignupView());
        },

        memberSignup: function(orgid) {
            console.log("member signup")
            this.loadView(new memberSignupView(orgid));
        },

        rushes: function() {
            if (!this.checkCurrentUser()) {
                console.log("login");
                this.loadView(new LogInView());
            } else {
                console.log("rushes");
                this.loadView(new DashboardView());
            }
        },

        profile: function(rushid) {
            if (!this.checkCurrentUser()) {
                this.loadView(new LogInView());
            } else {
                console.log("profile");
                this.loadView(new ProfileView(rushid));
            }
        },

        settings: function(){
            if (!this.checkCurrentUser()) {
                this.loadView(new LogInView());
            } else {
                console.log("profile");
                this.loadView(new SettingsView());
            }
        },

        checkCurrentUser: function() {
            // Parse.User.logOut();
            if (Parse.User.current()) {
                Parse.User.current().fetch();
                return true;
            }
            return false;
        },

        loadView: function(view) {
            this.view && (this.view.closeView ? this.view.closeView() : this.view.remove());
            // this.view && this.view.remove();
            this.view = view;
        }

    });

    var router = new AppRouter();
    // new AppView;
    Parse.history.start();
});