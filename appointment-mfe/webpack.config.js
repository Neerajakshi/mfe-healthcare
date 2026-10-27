const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
    mode: "development",

    output: {
        uniqueName: "appointment-mfe"
    },

    devServer: {
        port: 3002,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
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
        new ModuleFederationPlugin({
            name: "appointmentMfe",

            filename: "remoteEntry.js",

            exposes: {
                "./Appointments": "./src/Appointments"
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