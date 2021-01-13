const express = require('express');
const frontController = require('../controllers/frontController');


const frontRouter = express.Router();
function router() {
    const { middleware, loginTimeAndDate, editName, main, edit, uploadImage } = frontController();

    frontRouter.route('/')
        .get((req, res) => {

            res.render('index', {

            });
        });

    frontRouter.route('/login')
        .get((req, res) => {
            res.render('login', {
            });
        });
    frontRouter.route('/signUp')
        .get((req, res) => {
            res.render('signUp', {
            });
        });

    frontRouter.route('/main')
        .all(middleware)
        .get(main);

    frontRouter.route('/edit')
        .all(middleware)
        .get(edit)
        .put(uploadImage);

    frontRouter.route('/editName')
        .all(middleware)
        .put(editName);

    frontRouter.route('/loginTimeAndDate')
        .all(middleware)
        .get(loginTimeAndDate)


    frontRouter.route('/logout')
        .all(middleware)

        .get((req, res) => {
            req.logOut();

            req.session.destroy(function (err) {
                res.redirect('/');
            });
        });


    return frontRouter;
}
module.exports = router;

