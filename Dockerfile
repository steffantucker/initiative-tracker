#
# Builder
#

FROM golang:1.18 AS builder

# Create a workspace for the app
WORKDIR /

# Download necessary Go modules
COPY go.mod .
RUN go mod download && go mod verify

# Copy over the source files
COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o app .

#
# Runner
#

FROM scratch AS runner

WORKDIR /

# Copy from builder the final binary
COPY --from=builder /app /

ENTRYPOINT ["/app"]