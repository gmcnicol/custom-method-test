import { IntegrationBase } from "@budibase/types"
import fetch from "node-fetch"

interface Query {
  method: string
  body?: string
  headers?: { [key: string]: string }
}

interface Resp {
  url: string
  message: string
  function: string
}

class CustomIntegration implements IntegrationBase {
  private readonly url: string

  constructor(config: { url: string }) {
    this.url = config.url
  }

  async request(url: string, opts: Query) {
    const response = await fetch(url, opts)
    if (response.status <= 300) {
      try {
        const contentType = response.headers.get("content-type")
        if (contentType?.includes("json")) {
          return await response.json()
        } else {
          return await response.text()
        }
      } catch (err) {
        return await response.text()
      }
    } else {
      const err = await response.text()
      throw new Error(err)
    }
  }

  async create(query: { json: object }) {
    const opts = {
      method: "POST",
      body: JSON.stringify(query.json),
      headers: {
        "Content-Type": "application/json",
      },
    }
    return this.request(this.url, opts)
  }

  async read(query: { queryString: string }) {
    const r: Resp = {
      url: this.url,
      message: query.queryString,
      function: "read"
    }


    return JSON.stringify(r);
  }

  async readAdditional( query: {queryString: string}){
    const r: Resp = {
      url: this.url,
      message: query.queryString,
      function: "read additional"
    }


    return JSON.stringify(r);
  }

  async update(query: { json: object }) {
    const opts = {
      method: "PUT",
      body: JSON.stringify(query.json),
      headers: {
        "Content-Type": "application/json",
      },
    }
    return this.request(this.url, opts)
  }

  async delete(query: { id: string }) {
    const opts = {
      method: "DELETE",
    }
    return this.request(`${this.url}/${query.id}`, opts)
  }
}

export default CustomIntegration
