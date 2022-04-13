import React from "react";
import {
    Drawer,
    Layout,
    Divider,
    Statistic,
    List,
    Avatar,
    Input,
    message
} from 'antd';
import {AreaChartOutlined, WarningOutlined} from '@ant-design/icons';
import './index.less';

const { Header, Content, Footer } = Layout;

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            cur_item: null,
            changePw: false,
            newPw: null,
            id: "id",
            list: [
                {
                    name: "Moira",
                    id: "123456",
                    avatar: "https://joeschmoe.io/api/v1/random",
                    password: "123456",
                    email: "1155141582@link.cuhk.edu.hk",
                },
                {
                    name: "ZHAO",
                    id: "111111",
                    avatar: "https://joeschmoe.io/api/v1/random",
                    email: "1111@gmail.com",
                },
                {
                    name: "",
                    id: "",
                    avatar: "https://joeschmoe.io/api/v1/random",
                },
                {
                    name: "",
                    id: "",
                    avatar: "https://joeschmoe.io/api/v1/random",
                },
            ],
        }

    }

    // get users info
    componentDidMount() {
        fetch("/adminpage")
            .then(res=>res.json())
            .then(
                (result)=>{
                    this.setState({list:result})
                },
                (error)=>{
                    console.log("Fetch failed")
                }
            )

    }

    showDrawer = (id) => {
        this.setState({
            visible: true,
            cur_item: id,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onPwClick = () => {
        this.setState({changePw: true});
    }

    showInfo = () => {
        let res = [];
        for (var key in this.state.list[this.state.cur_item]){
            if (key !== "avatar" && key !== "password")
                res.push(<div style={{marginBottom: 10}}>{key}: {this.state.list[this.state.cur_item][key]}</div>);
        }
        res.push(<a onClick={this.onPwClick}><WarningOutlined /> change password</a>);
        res.push(this.state.changePw ?
                <div style={{paddingTop: 20}}>
                    <Divider/>
                        <div ><span style={{color: "#105c21"}}>New password: </span>
                            <Input.Password placeholder="please type new password and press enter to confirm"
                                            onPressEnter={this.onPwPressEnter}
                                            style={{width: 400, height: 35}}/>
                        </div>
                </div>
                : <div></div>)
        return res;
    };

    // change password by admin
    onPwPressEnter = (e) => {
        this.setState({pw: e.target.value});
        message.success("change password successfully");
        this.setState({changePw: false});
        console.log(this.state.list[this.state.cur_item][this.state.id]);
        fetch("/changePassword", {
            method: 'post',
            header: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "id": this.state.list[this.state.cur_item][this.state.id],
                "password": e.target.value,
            })
        });
    }

    render () {
        return (
            <Layout className="layout">
                <Header>
                    <div className="logo"> Admin </div>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <Statistic title="All Users" value={this.state.list.length} prefix={<AreaChartOutlined />}/>
                        <Divider />
                        <List
                            dataSource={this.state.list}
                            renderItem={(item, idx) => (
                                    <List.Item
                                       actions={[
                                           <a onClick={this.showDrawer.bind(this, idx)}>
                                               View Profile
                                           </a>
                                       ]}
                                    >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} />}
                                        title={item.name}
                                        description={<div>id: {item.id}</div>}
                                    />

                                    </List.Item>

                            )}
                        />
                        <Drawer
                            width={640}
                            placement="right"
                            onClose={this.onClose}
                            visible={this.state.visible}
                        >
                            <p className="title" style={{ marginBottom: 24 }}>
                                User Profile
                            </p>
                            <Divider />
                            {this.showInfo()}
                        </Drawer>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>MindForest@CSCI3100 Group E3</Footer>
            </Layout>
        );
    }
}