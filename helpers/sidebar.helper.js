const menu = {
  title: 'Dashboard',
  icon: 'mdi mdi-gauge',
  submenu: [
    {
      title: 'Main',
      url: '/'
    },
    {
      title: 'Progress',
      url: 'progress'
    },
    {
      title: 'Graficas',
      url: 'grafica1'
    },
    {
      title: 'Promesas',
      url: 'promises'
    },
    {
      title: 'RXJS',
      url: 'rxjs'
    }
  ]
};

const maintianceRoute = {
  title: 'Mantenimientos',
  icon: 'mdi mdi-folder-lock-open'
}

const userRoute = {
  title: 'Usuarios',
  url: 'users'
}

const doctorRoute = {
  title: 'Medicos',
  url: 'doctors'
}

const hospitalRoute = {
  title: 'Hospitales',
  url: 'hospitals'
}

function getMenu(role) {
  const routes = [];
  const submenu = [];
  switch (role.name) {
    case 'Administrador':
      submenu.push(userRoute, doctorRoute, hospitalRoute);
      break;
    
    case 'Usuario':
      submenu.push(doctorRoute, hospitalRoute);
      break;
  
    default:
      break;
  }

  maintianceRoute.submenu = submenu;
  routes.push(menu, maintianceRoute);
  return routes;
}

module.exports = {
  getMenu
}