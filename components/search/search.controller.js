// Requires
const msj = require('./../../shared/msj.shared');
const promisesManager = require('./promise.manager');

// Controller

class SearchController {
  static currentInstance = new SearchController();

  getAll(req, res) {
    const _this = SearchController.currentInstance;
    const searchParm = req.params.search;
    const fromOf = parseInt(req.query.fromOf) || 0;
    const regex = new RegExp(searchParm, 'i');
    const allPromises = _this.getAllPromises(regex, fromOf);

    Promise.all(allPromises).then(([hospitals, doctors, users]) => {
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
    const _this = SearchController.currentInstance;
    const searchParm = req.params.search;
    const fromOf = parseInt(req.query.fromOf) || 0;
    const regex = new RegExp(searchParm, 'i');
    const table = req.params.table.toLowerCase();
    const promise = _this.getPromiseById(table, regex, fromOf);

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

  getPromiseById(id, regex, count) {
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

  getAllPromises(regex, count) {
    const allPromises = [
      promisesManager.searchHospital(regex, count),
      promisesManager.searchDoctor(regex, count),
      promisesManager.searchUser(regex, count)
    ];

    return allPromises;
  }
}

// Export

module.exports = SearchController.currentInstance;