const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
    mode: "development",
    output: {
    uniqueName: "host"
    },

    devServer: {
        port: 3000
    },

    entry: "./src/index.jsx",

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            }
        ]
    },

    resolve: {
        extensions: [".js", ".jsx"]
    },

    plugins: [

        // Module Federation
        new ModuleFederationPlugin({
            name: "host",
            filename: "remoteEntry.js",
            remotes: {
              patientMfe: "patientMfe@http://localhost:3001/remoteEntry.js",
              appointmentMfe: "appointmentMfe@http://localhost:3002/remoteEntry.js"
            },
             exposes: {
                "./apiClient": "./src/api/apiClient"
            },
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: false
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: false
                },
                "react-redux": {
                    singleton: true,
                    requiredVersion: false
                },
                shared: {
                react: { singleton: true },
                "react-dom": { singleton: true }
                }
            }
        }),

        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ]
};