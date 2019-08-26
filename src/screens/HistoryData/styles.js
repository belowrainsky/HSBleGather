<<<<<<< HEAD
import {
  StyleSheet,
} from 'react-native';

export default {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mb20: {
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  largeText: {
    fontWeight: 'bold',
    fontSize: 54,
  },
  smallerText: {
    // fontWeight: 'bold',
    fontSize: 30,
  },
  rowflex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  recordField: {    
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  bottomButtonContainer: {
    marginTop: 40,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemLeft: {
    flex: 0.1,
  },
  itemRight: {
    flex: 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgb(235,235,235)',
    borderRadius: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  itemName: {
    color: '#333',
    fontSize: 20,
  },
  itemConnecting: {
    color: 'limegreen',
    fontSize: 20,
  },
  subtitle: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    textAlign: 'right',
  },
  buttonView: {
    height:30,
    backgroundColor:'rgb(33, 150, 243)',
    paddingHorizontal:10,
    borderRadius:5,
    justifyContent:"center",
    alignItems:'center',
    alignItems:'flex-start',
    marginTop:10
  },
  buttonText: {
    color:"white",
    fontSize:12,
  },
  content: {
    marginTop:5,
    marginBottom:15,
  },
  textInput: {
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:'white',
    height:50,
    fontSize:16,
    flex:1,
  },
  textFlex: {
    flex: 1,
    fontSize: 16,
  },
  listItem: {
    height: 50,
    fontSize: 16,
  },
  pickerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 140,
  },
  flatItem: {
    flexDirection: 'row',    
    alignItems: 'center',
    justifyContent: 'space-around',
    fontSize: 16,
  },
  timeFlex: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    color: 'black',
    fontSize: 16,
  },
  otherFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,  
    color: 'black',
  },
  columnStyle:{
    marginLeft: 10,    
  },
  innerViewStyle:{          
      flexDirection: 'row',
  },
  flatListStyle: {    
    alignItems:'center',     
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,

  },
  list2Style: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,    
    fontSize: 16,
  },
  tableContainer: { flex: 1, padding: 6, paddingTop: 5, backgroundColor: '#fff' },
  tableHead: { height: 40, backgroundColor: '#f38758' },
  tableText: { margin: 6, textAlign: 'center' },

=======
import {
  StyleSheet,
} from 'react-native';

export default {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mb20: {
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  largeText: {
    fontWeight: 'bold',
    fontSize: 54,
  },
  smallerText: {
    // fontWeight: 'bold',
    fontSize: 30,
  },
  rowflex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  recordField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  bottomButtonContainer: {
    marginTop: 40,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  itemLeft: {
    flex: 0.1,
  },
  itemRight: {
    flex: 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgb(235,235,235)',
    borderRadius: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  itemName: {
    color: '#333',
    fontSize: 20,
  },
  itemConnecting: {
    color: 'limegreen',
    fontSize: 20,
  },
  subtitle: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    textAlign: 'right',
  },
  buttonView: {
    height:30,
    backgroundColor:'rgb(33, 150, 243)',
    paddingHorizontal:10,
    borderRadius:5,
    justifyContent:"center",
    alignItems:'center',
    alignItems:'flex-start',
    marginTop:10
  },
  buttonText: {
    color:"white",
    fontSize:12,
  },
  content: {
    marginTop:5,
    marginBottom:15,
  },
  textInput: {
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:'white',
    height:50,
    fontSize:16,
    flex:1,
  },
  textFlex: {
    flex: 1,
    fontSize: 16,
  },
  listItem: {
    height: 40,
  }
>>>>>>> 17118f8b7c762a29eaadd552e1aef944b3b5d271
};