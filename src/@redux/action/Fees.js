import axios from "axios";
import { setFeesDetails } from "../feature/Fees";

export const getFeesAPI = (setPending) => async (dispatch, getState) => {
    setPending(true)

    let config = {
        method: 'get',
        url: `${getState().auth.baseurl}/config/fetchfee`
    };

    axios(config)
        .then((response) => {
            const data = response.data?.fees || []
            const filterData = data.filter(item => item.payer_flag === "u")
            dispatch(setFeesDetails(filterData))
            setPending(false)
        })
        .catch((error) => {
            console.log(error);
            setPending(false)
        });
}