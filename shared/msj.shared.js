class ExceptionManager {
  static currentInstance = new ExceptionManager();

  sendData(response, data) {
    const jsonText = {
      state: true,
      data
    }
    return response.status(200).json(jsonText);
  }

  createdData(response, data) {
    const jsonText = {
      state: true,
      data
    }

    return response.status(201).json(jsonText);
  }

  acceptedData(response, data) {
    const jsonText = {
      state: true,
      data
    };
    return response.status(202).json(jsonText);
  }

  noneAuthData(response, data) {
    const jsonText = {
      state: false,
      data
    };
    return response.status(203).json(jsonText);
  }

  badRequestData(response, msj, err) {
    const jsonText = {
      state: false,
      msj,
      errors: err
    };
    return response.status(400).json(jsonText);
  }

  unauthorizedRequestData(res, msj, err) {
    return res.status(401).json({
      state: false,
      msj,
      errors: err
    });
  }

  forbiddenRequestData(res, msj) {
    return res.status(403).json({
      state: false,
      msj
    });
  }

  notFountData(res, type, id) {
    const errors = {
      msj: `${type} ${id} not found`
    }
    return res.status(404).json({
      state: false,
      errors
    });
  }

  sendDataBaseError(res, err) {
    return res.status(500).json({
      state: false,
      msj: `Data Base Connection`,
      errors: err
    });
  }

}

module.exports = ExceptionManager.currentInstance;