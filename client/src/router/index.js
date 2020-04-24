import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Admin from '@/components/Admin'
import Display from '@/components/Display'
import Construction from '@/components/Construction'
import Manage from '@/components/Manage'
import ManageExhibitors from '@/components/ManageExhibitors'
import ManageBuyers from '@/components/ManageBuyers'
import ManageTransactions from '@/components/ManageTransactions'
import ManageProcessors from '@/components/ManageProcessors'
import NewExhibitor from '@/components/NewExhibitor'
import NewBuyer from '@/components/NewBuyer'
import NewTransaction from '@/components/NewTransaction'
import NewProcessor from '@/components/NewProcessor'
import EditBuyer from '@/components/EditBuyer'
import EditTransaction from '@/components/EditTransaction'
import EditProcessor from '@/components/EditProcessor'
import EditExhibitor from '@/components/EditExhibitor'
import BuyerTransaction from '@/components/BuyerTransaction'
import AddOnTransaction from '@/components/AddonTransaction'
import ExhibitorHistory from '@/components/ExhibitorHistory'
import GuiTransaction from '@/components/GuiTransaction'
import AddonDisplay from '@components/AddonDisplay'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'Login'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/display',
      name: 'Display',
      component: Display
    },
    {
      path: '/exhibitor/history',
      name: 'ExhibitorHistory',
      component: ExhibitorHistory
    },
    {
      path: '/transaction/gui',
      name: 'GuiTransaction',
      component: GuiTransaction
    },
    {
      path: '/buyer',
      name: 'Buyer',
      component: Construction
    },
    {
      path: '/transactionN',
      name: 'Transaction',
      component: Construction
    },
    {
      path: '/processor',
      name: 'Processor',
      component: Construction
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage
    },
    {
      path: '/manage/exhibitors',
      name: 'ManageExhibitors',
      component: ManageExhibitors
    },
    {
      path: '/manage/buyers',
      name: 'ManageBuyers',
      component: ManageBuyers
    },
    {
      path: '/manage/transactions',
      name: 'ManageTransactions',
      component: ManageTransactions
    },
    {
      path: '/manage/processors',
      name: 'ManageProcessors',
      component: ManageProcessors
    },
    {
      path: '/manage/exhibitors/new',
      name: 'NewExhibitor',
      component: NewExhibitor
    },
    {
      path: '/manage/buyers/new',
      name: 'NewBuyer',
      component: NewBuyer
    },
    {
      path: '/manage/buyer/edit',
      name: 'EditBuyer',
      component: EditBuyer
    },
    {
      path: '/manage/transactions/new',
      name: 'NewTransaction',
      component: NewTransaction
    },
    {
      path: '/manage/processors/new',
      name: 'NewProcessor',
      component: NewProcessor
    },
    {
      path: '/manage/transaction/edit',
      name: 'EditTransaction',
      component: EditTransaction
    },
    {
      path: '/manage/processor/edit',
      name: 'EditProcessor',
      component: EditProcessor
    },
    {
      path: '/manage/exhibitor/edit',
      name: 'EditExhibitor',
      component: EditExhibitor
    },
    {
      path: '/transaction/buyer',
      name: 'BuyerTransaction',
      component: BuyerTransaction
    },
    {
      path: '/transaction/addon',
      name: 'AddOnTransaction',
      component: AddOnTransaction
    },
    {
      path: '/addondisplay',
      name: 'AddonDisplay',
      component: AddonDisplay
    }
  ]
})
