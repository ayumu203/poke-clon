"use client"

import { useEffect, useState } from 'react'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import { useUser } from '../../../contexts/userContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTeamPokemonContext } from '../../../contexts/teamContext';
import { fetch_player } from '../../../libs/fetchPlayer';
import { fetch_first_option } from '../../../libs/fetchFirstPokemon';
import { Pokemon } from '../../../types/Pokemon';
import { send_first_pokemon } from '../../../libs/sendFirstPokemon';


export default function Home() {
    const { user } = useUser();
    const { addPokemon } = useTeamPokemonContext();
    const [ firstPokemonOption,setFirstPokemonOption ] = useState<Pokemon[] | null>(null);
    const [ selectName,setSelectName ] = useState<string|null>(null);
    const [ selectId,setSelectId ] = useState<number|null>(null);
    const [ selectIndex,setSelectIndex ] = useState<number>(-1);

    useEffect(()=>{
        if(user){
            const findFirstPokemon = async() => {
                // data = { player , pokemon:string }
                const data = await fetch_player(user.id);
                if(data.first_pokemon === "exist")router.push("/");
                const result:Pokemon[] = await fetch_first_option();
                setFirstPokemonOption(result);
            }
            findFirstPokemon();
        }
    },[user]);

    const handleSelection = (index:number) => {
        if(index === -1){
            setSelectName(null);
            setSelectId(null);
            setSelectIndex(-1);
        }
        if(firstPokemonOption){
            setSelectName(firstPokemonOption[index].name);
            setSelectId(firstPokemonOption[index].pokemon_id);
            setSelectIndex(index);
        }
    }
    const handleDetermination = async() =>{
        if(firstPokemonOption && selectIndex !== -1){
            const pokemon:Pokemon = firstPokemonOption[selectIndex];
            console.log(pokemon);
            addPokemon(pokemon);
            await send_first_pokemon(String(user?.id),Number(selectId));
            router.push('/');
        }
    }
    const router = useRouter();


    return (
    <div>
        <Header></Header>
        <main className='text-cyan-800'>
            <div>
                <p className='text-center bg-cyan-50' >いっしょに旅をする最初のポケモンを選びましょう!</p>
                <div className='h-[70vh] bg-gradient-to-b from-gray-100 to-cyan-100 flex items-center'>
                    {firstPokemonOption ?             
                        <div className='w-[100%] flex justify-evenly'>
                            <Image onClick={()=>{handleSelection(0)}} src={firstPokemonOption[0].front_image} width={40} height={40} style={{width:100,height:100}} alt="ポケモン1"></Image>
                            <Image onClick={()=>{handleSelection(1)}} src={firstPokemonOption[1].front_image} width={40} height={40} style={{width:90,height:90}} alt="ポケモン2"></Image>
                            <Image onClick={()=>{handleSelection(2)}} src={firstPokemonOption[2].front_image} width={40} height={40} style={{width:90,height:90}} alt="ポケモン3"></Image>
                        </div>
                    : <>Nowloading...</>}
                </div>
            </div>
            <div>
                {selectName&&firstPokemonOption && 
                <div className='flex flex-col items-center gap-2 mt-2 bg-gray-50'>
                    <p>{selectName}でよいですか？</p>
                    <button onClick={()=>{handleDetermination()}} className='mt-3 mb-3' type="button">はい</button>
                    <button onClick={()=>{handleSelection(-1)}} type="button">いいえ</button>
                </div>
                }
            </div>
        </main>
        <Footer></Footer>
    </div>
    )
}
