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
};