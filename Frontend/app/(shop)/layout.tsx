import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
const layout = ({children} :  { children: React.ReactNode }) => {
  return (
    <> 
    <Header/>
        <main>
            <div className="min-h-screen py-10">
                {children}
            </div>
        </main>
    <Footer/>
    </>
  )
}

export default layout
