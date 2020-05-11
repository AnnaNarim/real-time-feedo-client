import {createMuiTheme} from '@material-ui/core/styles';


export function getTheme() {
    return createMuiTheme({
        palette : {
            primary : {
                main : '#1976d2'
            }
        }
    })
};
