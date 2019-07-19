import React from 'react';
import {
  View, 
  Text,
  Alert,
  TextInput,
} from 'react-native';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  ListItem,
  Toast,
  Input,  
  Separator,
  DatePicker,
} from 'native-base';

import { NavigationEvents } from 'react-navigation';
import styles from "./styles";
import { Buffer } from 'buffer';

class HistoryData extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			chosenDate: new Date(),
			frequency: null,
			frequencyMode:null,
			celsius:null,
			channel: [],			
		};
		this.setDate = this.setDate.bind(this);
		HSBleManager = global.HSBleManager;
	}

	setDate(newDate){
		this.setState({ chosenDate: newDate });
		//根据时间从数据库中提取数据，并显示在相应的通道上
		//this.showData();
	}

	showData(){

	}

	componentWillUnmount() {
		HSBleManager.unmonitor();
		this.setState = (state, callback) => {
      		return;
   		 };	
	}
	
	render(){
		return(
			<Container>
				<Header>
					<Left style={{flex: 1}}>
						<Button transparent onPress={() => this.props.navigation.goBack()}>	
							<Icon name='arrow-back'/>
						</Button>
					</Left>
					<Body style={{flex:2, alignItems: 'center'}}>
						<Title>手动获取信息</Title>
					</Body>
					<Right style={{flex:1}}/>									
				</Header>			

				<Content>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<Text>  选择日期:  </Text>
						<DatePicker
							defaultDate={new Date(Date.now())}
							locale={"zh"}
							timeZoneOffsetInMinutes={undefined}
							modalTransparent={false}
							animationType={'fade'}
							androidMode={'default'}
							placeholder='选择日期'
							textStyle={{color: 'blue'}}
							placeHolderTextStyle={{color: '#d3d3d3'}}
							onDateChange={this.setDate}
							disabled={false}
						/>
					</View>					

					<Separator bordered>
						<Text>通道1</Text>
					</Separator>
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>	

					<Separator bordered>
						<Text>通道2</Text>
					</Separator>
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>

					<Separator bordered>
						<Text>通道3</Text>
					</Separator>
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>

					<Separator bordered>
						<Text>通道4</Text>
					</Separator>					
					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>时间：</Text>
							<Text style={{flex: 1}}>{this.state.collectAt}</Text>

							<Text style={{flex: 1}}>频率：</Text>
							<Text style={{flex: 1}}>{this.state.frequency}</Text>
						</View>
					</ListItem>

					<ListItem style={styles.listItem}>						
						<View style={styles.recordField}>
							<Text style={{flex: 1}}>频模：</Text>
							<Text style={{flex: 1}}>{this.state.mod}</Text>

							<Text style={{flex: 1}}>温度：</Text>
							<Text style={{flex: 1}}>{this.state.temperature}</Text>
						</View>
					</ListItem>										
				</Content>				
			</Container>
		);		
	}
}

export default HistoryData;
