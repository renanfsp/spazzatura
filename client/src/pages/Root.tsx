import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

function Root() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login', { replace: true })
  }, [navigate])

  return <Outlet />
}

export default Root
