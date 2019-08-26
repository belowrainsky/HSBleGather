import {
  StyleSheet,
} from 'react-native';

export default {
	container: {
		flex: 1,
	},

	buttonStyle:{		
		color: 'white',
		width: 50,
		height: 40,
		fontSize: 16,
	},

	inputStyle: {
		width: 50,
		height: 40,
		fontSize: 16,
	},

	textStyle: {
		textAlign: 'center',
		flex: 2,
	},
	listItem: {
		height: 50,
		fontSize: 16,
	},
	recordField: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
	    marginVertical: 20,
    },
    tableContainer: { flex: 1, padding: 6, paddingTop: 5, backgroundColor: '#fff' },
  	tableHead: { height: 40, backgroundColor: '#f38758' },
  	tableText: { margin: 6, textAlign: 'center' },
}