import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";


function AccountFormPage(){
    const user = useSelector((store) => store.session.user);
    const navigate = useNavigate()

    if(!user) navigate('/login')


    return (
        <div>
            <h1>Account Info</h1>

            <div>
            <img
                src='../../public/icons/user.png'
                alt=''
                className='icon'
            />
            <label>
                Name
                <div>
                    {user.firstName} {user.lastName}
                    <button><NavLink to={'name'}>{'>'}</NavLink></button>
                </div>
            </label>
            <label>
                Phone Number
                <div>
                    {user.phoneNumber ? user.phoneNumber : 'Add your phone number'}
                    <button><NavLink to={'phone'}>{'>'}</NavLink></button>
                </div>
            </label>
            <label>
                Email
                <div>
                    {user.email ? user.email : 'Add your email'}
                    <button><NavLink to={'email'}>{'>'}</NavLink></button>
                </div>
            </label>
            </div>
        </div>
    )
}

export default AccountFormPage