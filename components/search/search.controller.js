// Requires
const msj = require('./../../shared/msj.shared');
const promisesManager = require('./promise.manager');

// Functions

function getAllPromises(regex, count) {
  const allPromises = [
    promisesManager.searchHospital(regex, count),
    promisesManager.searchDoctor(regex, count),
    promisesManager.searchUser(regex, count)
  ];

  return allPromises;
}

function getPromiseById(id, regex, count) {
  let promise;

  switch (id) {
    case `doctor`:
      promise = promisesManager.searchDoctor(regex, count);
      break;

    case `hospital`:
      promise = promisesManager.searchHospital(regex, count);
      break;

    default:
      promise = promisesManager.searchUser(regex, count);
      break;
  }
  return promise;
}

// Controller

class SearchController {

  getAll(req, res) {
    const searchParm = req.params.search;
    const fromOf = parseInt(req.query.fromOf) || 0;
    const regex = new RegExp(searchParm, 'i');
    const allPromises = getAllPromises(regex, fromOf);

    Promise.all(allPromises).then(([users, hospitals, doctors]) => {
      const data = {
        result: { 
          users: {
            result: users,
            length: users.length
          }, 
          hospitals: {
            result: hospitals,
            length: hospitals.length
          },
          doctors: {
            result: doctors,
            length: doctors.length
          }
        }
      }
      return msj.sendData(res, data);
    }).catch(err => {
      console.error(err);
    });

  }

  getByTable(req, res) {
    const searchParm = req.params.search;
    const fromOf = parseInt(req.query.fromOf) || 0;
    const regex = new RegExp(searchParm, 'i');
    const table = req.params.table.toLowerCase();
    const promise = getPromiseById(table, regex, fromOf);

    if (!promise) {
      const err = {
        message: "Value for seach not found"
      }
      return msj.sendDataBaseError(res, err);
    }
  
    promise.then(resultData => {
      console.log(resultData.length);
      const data = {
        result: resultData,
      }
      return msj.sendData(res, data);
    });
  }
}

// Export

const controller = new SearchController();

module.exports = controller;