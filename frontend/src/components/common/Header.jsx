import React from 'react';
import '../../App.css';

import { Link } from 'react-router-dom';

function Header() {
    return (

        <div className='App-header'>
            <div className='App-header-name'>
                <h1> RemoteLog User Interface</h1>
            </div>
            <div className='App-header-buttonsdiv'>
                <Link to='/'>
                    <button> Home
                    </button>
                </Link>
                <Link to='/boards'>
                    <button >Boards
                    </button>
                </Link>
                <Link to='/contact'>
                    <button >Contact me!</button>
                </Link>
            </div>

        </div>
    );
}

export default Header;