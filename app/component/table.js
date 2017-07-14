import React from "react";
let Table = require('uxcore-table');

export default class Tables extends React.Component {

    constructor(props) {
        super(props);
		console.log(props)
        this.state = {
           data:this.props.data
        }
    }

    onModifyRow(value,dataKey,record) {
        //doValidate
        //debugger;
        //return false;
        return true;
    }

      render () {

        let me=this;
        // 通过 rowSelection 对象表明需要行选择
        let rowSelection = {
          onSelect: function(record, selected, selectedRows) {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: function(selected, selectedRows) {
            console.log(selected, selectedRows);
          }
        };

        let doAction= function(rowData,e) {
            let el=$(e.target);
            if(el.hasClass('action')) {
               if( el.data('type') =='edit') {
                  console.info(rowData,el.data('type'));
               }else if(el.data('type') =='del') {
                 console.info(rowData,el.data('type'));
               }
            }
        }
		let data = {
				  "data": [
				    {
				      "peerName": "北京",
				      "systemUserType": 1476230400000,
				      "userAccount": "xw@abc.com",
				      "id": "2016-10-12",
				      "userType": "bj",
				      "peertoken": "小王",
				      "userName": "xw"
				    },
				    {
				      "peerName": "杭州",
				      "systemUserType": 1477180800000,
				      "userAccount": "xl@abc.com",
				      "id": "2016-10-23",
				      "userType": "hz",
				      "peertoken": "小李",
				      "userName": "xl"
				    }
				  ],
				  "currentPage": 1,
				  "totalCount": 10
				}
        // title, width, type, hidden,dataKey
        let columns = [
            { dataKey: 'peerName', title: '城市', width: 50},
            { dataKey: 'systemUserType', title:'编号', width: 200},
            { dataKey: 'userAccount',title:'邮箱', width: 150},
            { dataKey: 'id',title:"日期" },
            { dataKey: 'userType' ,title:"城市简写"},
            { dataKey: 'peertoken',title:"姓名",width: 200},
			{ dataKey: 'userName',title:"姓名简写",width: 200},
            { dataKey: 'op', title:'操作', width:100, type:"action",actions:{
                "编辑": function(rowData, actions) {
                    console.log(actions.addEmptyRow);
					me.props.edit(rowData);
                    me.props.show();
                    me.refs.grid.toggleSubComp(rowData);
                },
                "删除": function(rowData) {
				    me.props.show();
                    me.refs.grid.delRow(rowData);
                }
              }
            }
        ]


        let renderProps={
            height: 400,
            actionColumn: {
               'edit': function() {},
               'del': function() {}
            },
			jsxdata : data,
            fetchParams: {},
            showColumnPicker:false,
            jsxcolumns:columns,
        };
        return (<Table {...renderProps}  ref="grid"/>);
      }
};
