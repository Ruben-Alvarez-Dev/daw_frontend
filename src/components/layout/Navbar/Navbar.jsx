import './Navbar.css'
import Button from '../../ui/Button/Button'
import Label from '../../ui/Label/Label'
import { FiCheck, FiClock, FiAlertCircle, FiUser, FiInfo } from 'react-icons/fi'

const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="navbar-brand">
          DAW Frontend
        </div>
        <div className="navbar-menu">Navbar Menu</div>
        <div className="navbar-menu">Navbar Context</div>
        <div className="navbar-auth">
            <Label text="Default" variant="label-default" icon={<FiUser />} />
            <Label text="Info" variant="label-info" icon={<FiInfo />} />
            <Label text="Success" variant="label-success" icon={<FiCheck />} />
            <Label text="Warning" variant="label-warning" icon={<FiClock />} />
            <Label text="Error" variant="label-error" icon={<FiAlertCircle />} />
          <Button 
            title="Login" 
            variant="primary" 
            onClick={() => console.log('login')} 
          />
          <Button 
            title="Register" 
            variant="secondary" 
            onClick={() => console.log('register')} 
          />
          <Button 
            title="Logout" 
            variant="delete" 
            onClick={() => console.log('logout')} 
          />
        </div>
      </nav>
    )
}

export default Navbar