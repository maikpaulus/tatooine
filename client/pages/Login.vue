<template>
    <div class="cmp-page cmp-page-login">
        <header>
            <h1>Willkommen auf Tatooine!</h1>
            <div class="logo">
                <img src="/assets/img/tatooine.png">
            </div>
        </header>
        <main>
            <form method="post" v-on:submit="submitForm">
                <input type="text" placeholder="Benutzername" v-model="login.username">
                <input type="password" placeholder="Passwort" v-model="login.password">
                <button type="submit">Anmelden</button>
            </form> 
        </main>
        <footer>

        </footer>
    </div>
</template>

<script>
    export default {
        data()  {
            return {
                login: {
                    username: '',
                    password: ''
                }
            }
        },

        methods: {
            submitForm(event) {
                event.preventDefault();
                this.$http.post('/login', {
                    username: this.login.username,
                    password: this.login.password
                }).then((response) => {
                    this.$router.push('/start');
                }).catch((err) => {

                });
                return false;
            }
        }
    }
</script>

<style lang="scss">
    @import './../App';
    
    .cmp-page-login {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: 50% 1fr 4em;

        header {
            justify-self: center;
            align-self: end;

            h1 {
                font-size: 2em; 
                text-align: center;
                margin-bottom: 1em;
            }

            .logo {
                border-radius: 5px;
                border: 3px solid $primary;
                margin: 0 auto;
                width: 30%;
                overflow: hidden;

                img {
                    width: 100%;
                }
            }
        }

        main {
            width: 100%;
            justify-self: center;
            align-self: center;
            form {
                width: 100%;

                input {
                    display: block;
                    width: 70%;
                    margin: 0 auto;
                    padding: 1em 2em;
                    border-radius: 5px;
                    border: 1px solid $gray;
                    user-select: none;
                    
                    + input {
                        margin-top: 0.5em;
                    }
                }

                button {
                    color: $white;
                    background: $primary;
                    padding: 1em 1em;
                    border-radius: 5px;
                    border: 0;
                    width: 40%;
                    margin: 2em auto 0;
                    display: block;
                    -webkit-appearance: none;
                    user-select: none;
                }
            }
        }
    }
</style>