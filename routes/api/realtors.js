const express = require('express'); //bring in express 
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const Realtor = require('../../models/Realtor');

// @route    POST api/realtors
// @desc     Register realtor
// @access   Public this route is public no auth needed 
//were sending data to this route
router.post(
  '/',
  //https://express-validator.github.io/docs/
  //with in route, we add 2nd param as middleware for validation. 
  // check('name', 'Name is required').notEmpty(),
  check('name', 'Name is required').not() .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // if there are errors what do we want to do as an resonse? 
      return res.status(400).json({ errors: errors.array() });
    }
    //we destructure and pull out these values, so not keep req.body
    const { name, email, password } = req.body; //initialzie midelware for body parser . server.js line 11... so we can send what ever data we want and access with request.body 

    try {
            //see if user exist 
      let realtor = await Realtor.findOne({ email });

      if (realtor) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Realtor already exists' }] });
      }

      //get gravitar 
      const avatar = normalize(
        gravatar.url(email, { //pass users email in this method to get gravitar 
          s: '200', //default size
          r: 'pg', //rating pg no nasty nasty
          d: 'mm' //default image
        }),
        { forceHttps: true }
      );

      realtor = new Realtor({
        name,
        email,
        avatar,
        password
      });
      //new instance of realtor

      //encrypt password
      const salt = await bcrypt.genSalt(10); //10 rounds for secure 

      realtor.password = await bcrypt.hash(password, salt); //takes in plain text password then the salt

      await realtor.save(); // save to DB

      //https://github.com/auth0/node-jsonwebtoken
      const payload = {
        realtor: {
          id: realtor.id //this the _id in the db, mongoose uses extraction, no underscore 
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {  //call back takes in err and token 
          if (err) throw err;
          res.json({ token }); //sending the token as response 
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;