const path = require("path")

module.exports = {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
        path: path.resolve(__dirname, "../production/src"),
        filename: "index.js",
        library: {
          type:"module"
        }
    },
    experiments: {
      outputModule:true
    },
    mode:"production",
    module: {
        rules: [
          {
            test: require.resolve("./src/index.js"),
            loader: "exports-loader",
            options: {
              type:"module",
              exports: "animateGradient",
            },
          },
        ],
    },
}