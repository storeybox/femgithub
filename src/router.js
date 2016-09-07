import app from 'ampersand-app'
import React from 'react'
import Router from 'ampersand-router'
import qs from 'qs'
import xhr from 'xhr'
import ReposPage from './pages/repos'
import PublicPage from './pages/public'
import Layout from './layout'

export default Router.extend({
  renderPage (page, opts = {layout: true}) {
    if (opts.layout) {
      page = (
        <Layout me={app.me}>
          {page}
        </Layout>
      )
    }
    React.render(page, document.body)
  },
  routes: {
    '': 'public',
    'repos': 'repos',
    'login': 'login',
    'logout': 'logout',
    'auth/callback?:query': 'authCallback'
  },

  public () {
    this.renderPage(<PublicPage/>, {layout: false})
  },

  repos () {
    this.renderPage(<ReposPage repos={app.me.repos}/>, {layout: true})
  },

  login () {
    window.location = 'https://github.com/login/oauth/authorize?' + qs.stringify({
      client_id: 'e11461bb3228b745ad8c',
      redirect_uri: window.location.origin + '/auth/callback',
      scope: 'user,repo'
    })
  },

  authCallback (query) {
    query = qs.parse(query)
    console.log(query)

    xhr({
      url: 'https://storeybox-oauth.herokuapp.com/authenticate/' + query.code,
      json: true
    }, (err, req, body) => {
      console.log(body)
      app.me.token = body.token
      this.redirectTo('/repos')
    })
  },

  logout () {
    window.localStorage.clear()
    window.location = '/'
  }
})
