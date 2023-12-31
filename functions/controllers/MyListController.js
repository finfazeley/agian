const User = require('../models/User');
const CarListing = require('../models/CarListing');
const findUser =  require('../utils/findUserById');

const navPages = [
    { name: 'Home', url: '/', active: false },
    { name: 'Sell', url: '/sell', active: false},
    { name: 'Login', url: '/auth', active: false},
    { name: 'MyList', url: '/myListings', active: true }
  ]

  exports.getML = (req, res, next) => {
    const userID = req.user;
    var login = true;
    if(!userID || userID === undefined) {
      login = false;
    }
    
    //const listings = await ListingController.getUserListings();
    findUser(userID).then(async user => {
      const listings = await getUserListings(user);
      res.render('mylistings', {
        navPages: navPages,
        login: login,
        user: user,
        listings: listings
      });
    });
  }


  // utility
getUserListings = async (uName) => {
    const listings = await CarListing.find().cursor().toArray();
    var newListings = [];
    for await (const list of listings) {
      if (list.user.name==uName){
        newList = {
          id: list._id.toHexString(),
          user: list.user.name,
          make: list.make,
          model: list.model,
          year: list.year,
          mileage: list.mileage,
          description: list.description,
          price: list.price
        }
        newListings.push(newList)
      }
    }
    console.log(newListings);
    return newListings;
  }