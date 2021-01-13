const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const moment = require('moment');


function router() {
    authRouter.route('/signUp')
        .post((req, res) => {
            const { firstName, lastName, email, password } = req.body;

            if (firstName && lastName && email && password) {
                if (firstName == '' || lastName == '' || email == '' || password == '') {
                    req.flash('success', "Please fill in  all the fields.");
                    return res.redirect('/signUp');
                } else {


                    (async function addUser() {
                        try {

                            const col = req.app.users;


                            const check = await col.findOne({ "email": email });

                            if (check) {
                                req.flash('success', "User already exist with this email");
                                res.redirect('/signUp')
                            } else {
                                const salt = await bcrypt.genSalt();
                                let hashedPassword = await bcrypt.hash(password, 10);
                                let a = moment();

                                const regDate = (a.format('YYYY-MM-DD')).toString();
                                const user = { firstName, lastName, "password": hashedPassword, email, regDate };

                                const results = await col.insertOne(user);
                                req.login(results.ops[0], () => {
                                    req.flash('success', "Registered succesfully");
                                    res.redirect('/main');

                                });

                            }
                        } catch (error) {
                            console.log(error);
                        }

                    }());

                }




            } else {
                req.flash('success', "Please fill in all the fields");
                return res.redirect('/signUp');
            }
        });




    authRouter.route('/login')
        .post
        (passport.authenticate('local', {
            successFlash: "Hey, Welcome back",
            successRedirect: '/main',
            failureRedirect: '/',
            failureFlash: true,


        }));

    return authRouter;

}

module.exports = router;