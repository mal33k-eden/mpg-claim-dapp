import React from 'react'
import {Link} from 'react-router-dom'
function PageNotFound() {
  return (
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
            <div class="max-w-md">
            <h1 class="text-5xl font-bold">404</h1>
            <p class="py-6">Page Not Found</p>
            <Link to='/' class="btn btn-primary">Home</Link>
            </div>
        </div>
    </div>
  )
}

export default PageNotFound