import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getBallsRewardContract } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import logo from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-LightVersion.svg'
import logo_dark from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-DarkVersion.svg'
import { useDarkModeManager } from '../../state/user/hooks'
import useBlock from '../../hooks/useBlock'
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'


// var Arrs = [[{
//     "title":"Pikachu Pool",
//     "name": "BALLS-BNB",
//     "double": "3.5x Rewards",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0xc87A534490E332dEd3B12c8e0D65b8d3A2f81BF1",
//     "img": "PokeSwap_Pikachu"
// },
// {
//     "title":"Mewtwo Pool",
//     "name": "DAI-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0xBfBcF9F695D701E817b526e234E71A38b0c93aa8",
//     "img": "PokeSwap_MewTwo"
// },
// {
//     "title":"Charmander Pool",
//     "name": "USDC-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0x4aD74C9aB67B8e2b8305a83BF8C3834803B292d8",
//     "img": "PokeSwap_Charmander"
// }], 
// [{
//     "title":"Charizard Pool",
//     "name": "YFI-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0x0c3016734670664B3930Ea86fCD04eDd284CC0BC",
//     "img": "PokeSwap_Charizard"
// },
// {
//     "title":"Squirtle Pool",
//     "name": "SNX-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0x49d0281A7bEb98c0f09b313eF025d43c99c0D78B",
//     "img": "PokeSwap_Squirtle"
// },
// {
//     "title":"Rhydon Pool",
//     "name": "LINK-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0x3C88c2Be0092d82D811351cD2db6f8d35De62E1d",
//     "img": "PokeSwap_Rhydon"
// }],[
// {
//     "title":"Bulbasaur Pool",
//     "name": "AAVE-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0x5957CE7D889Cf6d26b886a5aE4B8C7babaDF9241",
//     "img": "PokeSwap_Bulbasaur"
// },
// {
//     "title":"Psyduck Pool",
//     "name": "UNI-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0xE889F3C9c1D8Eea756867a9E09b738Bb2F4a1486",
//     "img": "PokeSwap_Psyduck"
// },
// {
//     "title":"Rattata Pool",
//     "name": "USDT-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0xad00fd3637867038E209a5Efd34436279A74421b",
//     "img": "PokeSwap_Rattata"
// }],[
// {
//     "title":"Meowth Pool",
//     "name": "WBTC-BNB",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0x5eF11C873D14F41B86A9594B16f2f3A0Ca525d4e",
//     "img": "PokeSwap_Meowth"
// },{
//     "title":"",
//     "name": "",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0xc87A534490E332dEd3B12c8e0D65b8d3A2f81BF1",
//     "img": "PokeSwap_Rattata"
// }, {
//     "title":"",
//     "name": "",
//     "double": "( 1x  Rewards )",
//     "value_a":'0.0000',
//     "value_e":'0.0000',
//     "pair": "0xc87A534490E332dEd3B12c8e0D65b8d3A2f81BF1",
//     "img": "PokeSwap_Rattata"
// }]
var Arrs = [[{
    "title":"Pikachu Pool",
    "name": "BALLS-BNB",
    "double": "3.5x Rewards",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0x78BC98F0fD66bf43B6fBf08148224F1609735790",
    "img": "PokeSwap_Pikachu"
},
{
    "title":"Mewtwo Pool",
    "name": "DAI-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0xaa8178C277557Aa6185D8556D765f556011105D7",
    "img": "PokeSwap_MewTwo"
},
{
    "title":"Charmander Pool",
    "name": "USDC-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0x72CBcE81dfAFb5d7D95Fdb1B319FC74788f3BD37",
    "img": "PokeSwap_Charmander"
}], 
[{
    "title":"Charizard Pool",
    "name": "YFI-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0xc037b10F31b410738999a24418802Da62AD216Aa",
    "img": "PokeSwap_Charizard"
},
{
    "title":"Squirtle Pool",
    "name": "SNX-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0xbA22c738223394d93dA8CaF09103526Ab6102CBF",
    "img": "PokeSwap_Squirtle"
},
{
    "title":"Rhydon Pool",
    "name": "LINK-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0x779FC964F2EC3C6Cb2d2E75dd4E3cf4563Ad102C",
    "img": "PokeSwap_Rhydon"
}],[
{
    "title":"Bulbasaur Pool",
    "name": "AAVE-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0x7792D72580076cFC53e58d5d098916220C672fc9",
    "img": "PokeSwap_Bulbasaur"
},
{
    "title":"Psyduck Pool",
    "name": "UNI-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0x3436E8E52847cB1E29E147EE07582f5295668882",
    "img": "PokeSwap_Psyduck"
},
{
    "title":"Rattata Pool",
    "name": "USDT-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0x82cE6546b3BB212A381Fb2b006F19dba4e71491c",
    "img": "PokeSwap_Rattata"
}],[
{
    "title":"Meowth Pool",
    "name": "WBTC-BNB",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0xe68ff1EA3B6Abb992a678fa3A0a4c3582Ea599d2",
    "img": "PokeSwap_Meowth"
},{
    "title":"",
    "name": "",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0xc87A534490E332dEd3B12c8e0D65b8d3A2f81BF1",
    "img": "PokeSwap_Rattata"
}, {
    "title":"",
    "name": "",
    "double": "( 1x  Rewards )",
    "value_a":'0.0000',
    "value_e":'0.0000',
    "pair": "0xc87A534490E332dEd3B12c8e0D65b8d3A2f81BF1",
    "img": "PokeSwap_Rattata"
}]

]
const CardStyle = styled.div`
    border: 1px solid ${({ theme }) => theme.text6};;
    width: 260px;
    margin:20px;
    font-size: 20px;
    float: left;
    border-radius: 10px;
    background: ${({ theme }) => theme.text6};
    box-shadow: 10px 10px 100px rgb(224 38 82 / 0.1);
    @media (max-width:480px){
        clear:both;
        width:100%;
        margin:0;
        margin-top:20px;
      }
`
const CardNone = styled.div`
width: 260px;
margin: 20px;
font-size: 20px;
float: left;
border-radius: 10px;
background: black;
`
const BoxStyle = styled.div`
text-align: center;
@media (max-width:480px){
    padding-left:0;
    width:100%;
  }
`
const ButtonStyle = styled.button`
background: #f55b70;
    border: 0;
    width: 90%;
    color: #f8f8f9;
    outline: none;
    border: 1px solid #e87e7e;
    height: 40px;
    font-weight: bold;
    border-radius: 7px;
    font-size: 16px;
    cursor: pointer;
`
const TittlStyle = styled.div`
  font-size:24px;
  font-weight:bold;
  margin-top: 20px;
  margin-bottom: 20px;
`
const Detailstyle = styled.div`
color: #908c8c;
font-size: 13px;
`
const BottomBoxStyle = styled.div`
font-size: 12px;
    background: ${({ theme }) => theme.bg10};;
    height: 30px;
    color: #e63030;
    border-radius: 7px;
    width: 90%;
    margin-left: 5%;
    line-height: 30px;
    margin-top:15px;
    margin-bottom:15px;
`


export default function Rewards() {
    const { t } = useTranslation();
    const block = useBlock();
    const [isDark] = useDarkModeManager()
    const { account, chainId, library } = useActiveWeb3React()
    const [arrs,setArrs] = useState(Arrs)
    const [listTable,setListTable] = useState([])
    const [flag,setFlag] = useState(false);

    useEffect(() => {
        setListData();
        makeListTable()

    }, [block, account,setFlag])
    async function setListData(){
        if (!chainId || !library || !account) return
        const ballsRewardContract = getBallsRewardContract(chainId, library, account);
        let arrsD:any = []
        for(var i=0;i<arrs.length;i++){
            for(var j=0;j<arrs[i].length;j++){
                let reward_a = await ballsRewardContract.viewReward(arrs[i][j].pair, account, true);
                if(reward_a){
                    let reward = Number(reward_a[0] * 10 / 11 / 10 ** 18).toFixed(4)
                    arrs[i][j].value_a = reward;
                }
                let curId = await ballsRewardContract.getCurrentPeriodId();
                let amounts = await ballsRewardContract.pairUserPeriodAmount(arrs[i][j].pair, account, curId);
                let ams =  Number(amounts / 10 ** 18).toFixed(4);
                arrs[i][j].value_e = ams;
            }
            arrsD.push(Arrs[i])
        }
        setArrs(arrsD)
        setFlag(true)
    }

    function makeListTable(){
        // if(!arrs || arrs.length==0) return;
        let listTable:any = arrs.map((items,keys)=>{
            return(<>
                <BoxStyle key={keys}>
                    {items.map((item,key)=>{
                        
                        return(
                            <>{item.title===""?(<>
                            <CardNone key={key}></CardNone>
                            </>):(
                                <CardStyle key={item.title}>
                                    <p>
                                        <img style={{ width: '25%' }} src={require('../../assets/benefit/'+item.img+'.svg')} />
                                    </p>
                                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                    <div style={{ fontSize: '15px', color: 'red' }}> {item.double==='( 1x  Rewards )'?(<>&nbsp;</>):item.double} </div>
                                    <Detailstyle>{item.name}</Detailstyle>
                                    <div style={{ marginTop: '13px' }}>
                            <ButtonStyle onClick={() => claimReward(item.pair)}>{t('reward_bt1')}</ButtonStyle>
                                    </div>
                                    <BottomBoxStyle>
                                    {t('reward_bt2')}<span style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>{flag?item.value_a:"loading..."}</span>
                                    </BottomBoxStyle>
                                    <BottomBoxStyle>
                                    {t('reward_bt3')}<span style={{ display: 'inline-block', width: '56%', textAlign: 'right' }}>{flag?item.value_e:"loading..."} BNB</span>
                                    </BottomBoxStyle>
                                </CardStyle> 

                            )}
                               
                            </>
                        )
                    })}
                </BoxStyle>
            </>)
        })
        setListTable(listTable)
    }

    // async function getReward(pair:any) {
    //     if (!chainId || !library || !account) return
    //     const ballsRewardContract = getBallsRewardContract(chainId, library, account);
    //     let dai_active = await ballsRewardContract.viewReward(pair, account, true);
    //     return Number(dai_active[0] * 10 / 11 / 10 ** 18).toFixed(4)
    // }
    // async function getUserPeriodAmount(pair:any) {
    //     if (!chainId || !library || !account) return
    //     const ballsRewardContract = getBallsRewardContract(chainId, library, account);
        
    // }

    function claimReward(pair: any) {
        if (!chainId || !library || !account) return
        const ballsRewardContract = getBallsRewardContract(chainId, library, account);
        ballsRewardContract.getReward(pair)
            .then((response: any) => {
                console.log(response.hash)
            })
    }

    return (
        <>
        <div style={{marginTop:isMobile?"80px":"0px"}}>&nbsp;</div>
            <div style={{ textAlign: 'center' }}>
                <img style={{ width: '30%' }} src={isDark ? logo_dark : logo} />
                <TittlStyle>
                   {t('reward_title')}
                </TittlStyle>
            </div>
            {listTable}
            
        </>
    )
}