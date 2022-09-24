const authRoutes = require(`./../routes/auth`);
const classRoomRoutes = require(`./../routes/classroom`);
const fileRoutes = require(`./../routes/file`);

const Routes = [authRoutes, classRoomRoutes, fileRoutes];

module.exports = Routes;
