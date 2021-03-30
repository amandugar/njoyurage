const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const session = require('express-session');
const passport = require("passport");
const fs = require("fs");
const fileUpload = require("express-fileupload")
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

const port = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(fileUpload());

let usernameAuthenticated;

app.use(passport.initialize());
app.use(passport.session());
try {
    mongoose.connect("mongodb+srv://njoyurage:njoyurage@cluster0.pjnmd.mongodb.net/nJoyUrAge?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
} catch (error) {
    console.log(error)
}

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
});

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    subTitle: String,
    time: String,
    content: String,
    image: String
})

const vlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    link: String,
    time: String
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Post = new mongoose.model("Post", postSchema)
const Vlog = new mongoose.model("Vlog", vlogSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


fs.readFile('services.json', function (err, data) {
    if (err) throw err;
    services = JSON.parse(data);
    console.log(services[0].knowMore[0].heading)
})

app.get("/", function (req, res) {
    res.render("home")
})

app.get("/about", function (req, res) {
    res.render("about")
})

app.get("/services", function (req, res) {
    res.render("services", {
        services: services
    })
})
let featuredPost;
app.get("/blogs", function (req, res) {
    Post.find({}, function (err, posts) {
        if (err) {
            res.send(err)
        } else {
            fs.readFile('featuredPost.json', function (err, data) {
                if (err) {
                    res.send("Error")
                } else {
                    featuredPost = JSON.parse(data);
                    console.log(featuredPost)
                }
            })
            setTimeout(() => {
                res.render("blogs", {
                    blogs: posts,
                    feature: featuredPost
                })
            }, 2000)
        }
    })
})

app.get("/admin/:username/deleteBlog", function (req, res) {
    if (req.isAuthenticated() && usernameAuthenticated === req.params.username) {
        Post.find({}, function (err, data) {
            if (err) {
                res.send("Error")
            } else {
                Vlog.find({}, function (err, vlogs) {
                    if (err) {
                        res.redirect("/error")
                    } else {
                        res.render("deleteBlog", {
                            posts: data,
                            vlogs: vlogs
                        })
                    }
                })
            }
        })
    } else {
        res.redirect("/")
    }
})

app.post("/deleteBlog", function (req, res) {
    if (req.isAuthenticated()) {
        Post.findOneAndDelete({
            _id: req.body.deletePost
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                fs.unlink(__dirname + `/public/images/uploads/${data.image}`, function (err) {
                    if (err) {
                        res.send("Error")
                        console.log(err)
                    } else {
                        console.log(req.body.deletePost)
                        res.send("Done");
                    }
                })
            }
        })
    } else {
        res.redirect("/")
    }
})

app.get("/admin", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect(`/admin/${usernameAuthenticated}`)
    } else {
        res.redirect("/login")
    }
})

app.get("/admin/:username", function (req, res) {
    if (req.isAuthenticated() && req.params.username === usernameAuthenticated) {
        res.render("admin", {
            username: usernameAuthenticated
        })
    } else {
        res.redirect("/login")
    }
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.post("/login", function (req, res) {
    let username = req.body.username;
    const user = new User({
        username: username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            try {
                passport.authenticate("local")(req, res, function () {
                    usernameAuthenticated = username;
                    res.redirect(`/admin/${username}`);
                });
            } catch (error) {
                res.redirect("/error")
            }
        }
    });

});

app.get("/admin/:username/createUser", function (req, res) {
    if (req.isAuthenticated() && req.params.username === usernameAuthenticated) {
        res.render("signup")
    } else {
        res.redirect("/");
    }
})

app.post("/signup", function (req, res) {

    User.register({
        email: req.body.email,
        username: req.body.username,
        name: req.body.name
    }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/signup");
        } else {
            res.send("Created");
        }
    });

});

app.get("/admin/:username/createBlog", function (req, res) {
    if (req.isAuthenticated() && usernameAuthenticated == req.params.username) {
        res.render("create", {
            username: req.params.username
        })
    } else {
        res.redirect("/blog")
    }
})

let image;

app.post("/admin/:username/createBlog", function (req, res) {
    if (req.isAuthenticated() && usernameAuthenticated == req.params.username) {
        let author = "NJoyUrAge";
        let title = req.body.title;
        let content = req.body.content;
        let subTitle = req.body.subTitle;
        let time = Date(Date.now());

        console.log(req.body)
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            return;
        }
        image = req.files.image;

        uploadPath = __dirname + '/public/images/uploads/' + image.name;

        image.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            const newPost = new Post({
                author: author,
                title: title,
                subTitle: subTitle,
                content: content,
                time: time,
                image: image.name
            })
            newPost.save(function (err, post) {
                if (err) {
                    console.log(err)
                    res.render("404")
                } else {
                    res.redirect("/admin/" + usernameAuthenticated)
                }
            })
        });
    } else {
        res.redirect("/blog")
    }
})

app.get("/blogs/:id", function (req, res) {
    Post.findOne({
        _id: req.params.id
    }, function (err, post) {
        if (err) {
            res.send("Error")
        } else {

            res.render("singlePost", {
                blog: post
            })
        }
    })
})

app.get("/vlogs", function (req, res) {
    Vlog.find({}, function (err, data) {
        if (err) {
            res.redirect("/error")
        } else {
            res.render("vlogs", {
                vlogs: data
            })
        }
    })

})

app.get("/admin/:username/create-vlog", function (req, res) {
    if (req.isAuthenticated() && usernameAuthenticated === req.params.username) {
        res.render("createVlog", {
            username: usernameAuthenticated
        })
    } else {
        res.redirect("/error")
    }
})

app.post("/create-vlog", function (req, res) {
    if (req.isAuthenticated()) {
        let title = req.body.title;
        let content = req.body.content
        let link = req.body.link;
        let time = Date(Date.now())
        const newVlog = new Vlog({
            title: title,
            link: link,
            content: content,
            time: time,
        })
        newVlog.save(function (err) {
            if (err) {
                console.log(err)
            } else {
                res.send("Sucessfully Created a Vlog")
            }
        })
    } else {
        res.redirect("/error")
    }
})

app.post("/deleteVlog", function (req, res) {
    console.log(req.body.deleteVlog)
    if (req.isAuthenticated()) {
        Vlog.findOneAndDelete({
            _id: req.body.deleteVlog
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send(data);;
            }
        })
    } else {
        res.redirect("/")
    }
})

app.get("/admin/:username/change-featured-post", function (req, res) {
    if (req.isAuthenticated() && usernameAuthenticated === req.params.username) {
        Post.find({}, function (err, data) {
            if (err) {
                res.send("Error")
            } else {
                res.render("changeFeaturePost", {
                    posts: data
                })
            }
        })
    } else {
        res.redirect("/")
    }
})

app.post("/change-featured-post", function (req, res) {
    if (req.isAuthenticated()) {
        Post.findOne({
            _id: req.body.featurePost
        }, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                fs.writeFile("featuredPost.json", JSON.stringify(data), err => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send("changed");
                    }
                })
            }
        })
    } else {
        res.redirect("/")
    }
})



app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


app.get("/error", function (req, res) {
    res.send("error")
})

app.get("**", function (req, res) {
    res.redirect("/error")
})

app.listen(port, function (req, res) {
    console.log(`Listening on port ${port}`)
})