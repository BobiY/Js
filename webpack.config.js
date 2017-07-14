
const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: './app.js',
    output: {
        publicPath: "/assets/",
        filename: 'bundle.js'
    },
	module:{
		rules:[
           {
           	    //使用babel编译js文件
	           	test:/\.js$/,
	           	use:[{
		          loader:"babel-loader",
		          options:{
		            presets:["es2015","react"]
		          }
		        }],
	           	exclude: [
		          path.resolve(__dirname, "node_modules")
		        ]
           },
           {
              //编译css文件
	           	test:/\.css$/,
                use: ['style-loader','css-loader','postcss-loader']
           },
           {
                //编译less文件
           	    test:/\.less$/,
           	    use: ['style-loader','css-loader',"postcss-loader",'less-loader']

           }]},
    devServer: {
        contentBase: path.join(__dirname, "app/html"),
        port: 3333,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
