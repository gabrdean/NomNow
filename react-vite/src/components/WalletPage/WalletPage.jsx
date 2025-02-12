import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addFundsThunk } from "../../redux/session"
function WalletPage(){
    const user = useSelector((store) => store.session.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if(!user) navigate('/login')

    const addFunds = (e) => {
        e.preventDefault()
        console.log('USER:', user)

        const fundsObject = {
            id: user.id,
            amount: 1000.99
        }
        dispatch(addFundsThunk(fundsObject))
    }

    return(
        <div>
            <h1>Wallet Page</h1>

            <h2>Wallet Balance: $ {user.wallet}</h2>

            <button onClick={e=> addFunds(e)}>Add Funds</button>
        </div>
    )
}


export default WalletPage