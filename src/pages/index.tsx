import Image from 'next/image'

import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import IconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'


interface HomeProps {
  poolCount: number,
  guessCount: number,
  userCount: number,
}


export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = useState('')

  
  async function createPool(event: FormEvent){
    event.preventDefault()

    try{

      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Pool created successfully, the code was copied to your transference area')

      setPoolTitle('')

    } catch(error){
      alert('Error trying to crete the pool, try again')
    }

   
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main className=''>
        <Image src={logoImg} alt="logo" quality={100} />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Create your own betting pools and share with your friends!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="users example image" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-cupGreen-500'>+{props.userCount}</span> are already using
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100'
            type="text"
            required
            placeholder="What's your betting pool name?"
            onChange={event => setPoolTitle(event.target.value)} 
            value={poolTitle}
            />
          <button className='bg-cupYellow-500 px-6 py-4 rounded text-gray-900 font-bold uppercase text-sm hover:bg-cupYellow-700'>Crete pool</button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          After creating your pool, you will receive a unique code that you can use to invite others 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={IconCheck} alt="." />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Pools created</span>
            </div>
          </div>

        <div className='w-px h-14 bg-gray-600'></div>

          <div className='flex items-center gap-6'>
            <Image src={IconCheck} alt="." />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Bets</span>
            </div>
          </div>
        </div>

      </main>

      <Image src={appPreviewImage} alt="preview in the cellphone image" quality={100} />
    </div>

  )
}

export const getServerSideProps = async () => {

  const [
    poolCountResponse, 
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return{
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}