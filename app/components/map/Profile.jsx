import { useContext, useState } from 'react'
import { Menu, MenuList, MenuItem, MenuButton, Button } from '@chakra-ui/react'
import { SessionContext } from '~/contexts/SessionContext'
import { FaCog, FaUserAlt, FaSignOutAlt } from 'react-icons/fa'
import { createBrowserClient } from '@supabase/auth-helpers-remix'
import { redirect } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'

export default function Profile({ supabaseKeys }) {
  const session = useContext(SessionContext)
  const navigate = useNavigate()

  const supabase = createBrowserClient(
    supabaseKeys.DATABASE,
    supabaseKeys.SUPABASE_KEY
  )

  const logOut = async () => {
    const { error } = await supabase.auth.signOut()
    console.log(error)
  }

  return (
    <div className="profile">
      {session === null ? (
        <Menu className="profile">
          <MenuButton as={Button} leftIcon={<FaUserAlt />}>
            {session.user.email}
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaUserAlt />}>Profile</MenuItem>
            <MenuItem icon={<FaCog />}>Settings</MenuItem>
            <MenuItem icon={<FaSignOutAlt />} onClick={logOut}>
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button onClick={() => navigate('/signup')}>Sign In</Button>
      )}
    </div>
  )
}
