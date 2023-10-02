import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

import * as opentelemetry from '@opentelemetry/api'

const trace = opentelemetry.trace

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces'
})

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `DREAD`,
    [SemanticResourceAttributes.SERVICE_VERSION]:
      process.env.npm_package_version ?? '0.0.0',
    env: process.env.NODE_ENV || ''
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  spanProcessor: new BatchSpanProcessor(traceExporter)
})

sdk.start()

export const tracer = trace.getTracer(
  'instrumentation-scope-name',
  'instrumentation-scope-version'
)

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch(error => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0))
})

process.on('SIGINT', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch(error => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0))
})
