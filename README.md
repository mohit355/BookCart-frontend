(npm start runs our react in development mode only)

### How to host on Digital ocean

##### 1. Create a simple Node Express server inside react app

    1.1  create a file in react app named as - server.js
    1.2 write down the following code so that we can server everything form index.html file that exist in build folder created after running npn run build
    Code:

    const express = require("express");

    const compression = require("compression");
    const path = require("path");

    const app = express();

    app.use(compression);
    app.use(express.static(path.join(\_\_dirname, "build")));

    app.get("\*", (req, res) => {
    res.sendFile(path.join(\_\_dirname, "build", "index.html"));
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
    });


    2. Push your code on github
