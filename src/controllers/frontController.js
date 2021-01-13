const express = require('express');
let Router = express.Router();
let multer = require('multer');
let path = require('path');
const moment = require('moment');


Router.use(express.static(__dirname + "./public/"));




function frontController() {

    function middleware(req, res, next) {
        if (req.session.passport) {
            next();
        } else {
            res.redirect('/');
        }
    }

    function edit(req, res) {


        res.render('edit');


    }
    function uploadImage(req, res) {
        const match = req.user.email;


        let storage = multer.diskStorage({
            destination: "./public/uploads/",
            filename: (req, file, cb) => {
                cb(null, "email_" + match + "_" + Date.now() + path.extname(file.originalname));
            }
        });
        let upload = multer({
            storage: storage,
            limits: { fileSize: 20000000 },

        }).single('image');
        upload(req, res, (err) => {
            if (err) {
                res.send(err);
            } else {
                if (!req.file) {
                    return res.send('Please select an image to upload');
                }
                let imageName = req.file.filename;

                let originalName = req.file.originalname;
                (async function () {
                    try {
                        let col = req.app.users;

                        const result = await col.find({ "email": match }).toArray();

                        if (result[0]) {
                            const finalUpdate = await col.replaceOne({ "email": match }, {
                                "firstName": result[0].firstName,
                                "lastName": result[0].lastName,
                                "image": imageName,
                                "email": match,
                                "password": result[0].password
                            });


                            req.flash('success', `Image ${originalName} & other details successfully Updated.`);
                            res.redirect('/main');


                        } else {
                            res.send('user not matched');
                        }


                    } catch (error) {
                        console.log(error);
                    }

                }());



            }
        });
        //   }


    }
    function editName(req, res) {
        const match = req.user.email;

        let { firstName, lastName } = req.body;


        (async function () {
            let col = req.app.users;

            const result = await col.find({ "email": match }).toArray();

            let updateName;
            let updateLastname;

            if (result[0]) {

                if (firstName) {
                    updateName = firstName;
                } else {
                    updateName = result[0].firstName;
                }
                if (lastName) {
                    updateLastname = lastName;
                } else {
                    updateLastname = result[0].lastName
                }

                try {
                    const finalUpdate = await col.replaceOne({ "email": match }, {
                        "firstName": updateName,
                        "lastName": updateLastname,
                        "image": result[0].path,
                        "email": match,
                        "password": result[0].password
                    });


                    req.flash('success', ` Name  successfully Updated.`);
                    res.redirect('/main');

                } catch (error) {
                    console.log(error);
                }


            } else {
                res.send('user not matched');
            }

        }())
    }


    function main(req, res) {
        const match = req.user.email;
        let a = moment();

        const perTime = (a.format('YYYY-MM-DD, h:mm:ss a')).toString();
        (async function mongo() {
            try {
                const col = await req.app.users;
                let loginTimee = await col.findOneAndUpdate({ "email": match }, { $set: { loginTime: perTime } },

                )

                const user = await col.find().toArray();


                res.render('main', {
                    user: user
                });

            } catch (error) {
                console.log(`this is happening ${error} `);
            }

        }());
    }

    function loginTimeAndDate(req, res) {
        let user = req.user.email;
        (async function mongo() {
            try {
                const col = await req.app.users;
                const data = await col.findOne({ "email": user });

                res.render('loginTimeAndDate', {
                    data: data
                });

            } catch (error) {
                console.log(`this is happening ${error} `);
            }

        }());
    }

    return {
        middleware,
        edit,
        uploadImage,
        editName,
        main,
        loginTimeAndDate,
    };
}

module.exports = frontController;