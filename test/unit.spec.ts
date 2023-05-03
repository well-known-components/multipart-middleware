import { FormDataContext, multipartParserWrapper } from "../src"
import expect from "expect"
import { createTestServerComponent } from '@well-known-components/http-server'
import { Router } from '@well-known-components/http-server'
import FormData from 'form-data'
import fs from 'fs'

describe("unit", () => {
  it("smoke test", async () => {
      const server = createTestServerComponent()
      const router = new Router<any>()
      server.use(router.middleware())

      router.post('/test', 
                  multipartParserWrapper(async(ctx: FormDataContext<{}>)  => {
                      expect(ctx.formData.files['my_file']).toBeTruthy()
                      expect(ctx.formData.files['my_file'].filename).toEqual('bar.jpg')
                      expect(ctx.formData.files['my_file'].mimeType).toEqual('image/jpeg')
                      return {
                          status: 200
                      }
                  }))

      const form = new FormData()
      form.append('my_file', fs.createReadStream('test/bar.jpg'), 'bar.jpg' );

      const res = await server.fetch('/test', {
          method: 'POST',
          body: form
      })
      expect(res.status).toEqual(200)
  })
})
