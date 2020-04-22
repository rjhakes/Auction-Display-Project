<template>
    <main class="addon_display">
        <h1 class="addon_display_header">Addon Buyers</h1>
        <div class="table_view">
        <table class="addon_display_table">
            <thead>
                <tr>
                    <th class="table_c1"></th>
                    <th class="table_c2"></th>
                    <th class="table_c3"></th>
                </tr>
            </thead>
            <tbody>
                <tr class="addon_table_rows">
                    <td>{{buyers[b].name }}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </main>
</template>

<script>
    import{mapState, mapActions} from 'vuex'
    export default {
        data() {
            return{
                addonDisplaySpeed: 15000,   // Needs Testing
                buyers: []
            }
        },
        created: function() {
            setInterval(() => this.addonDisplaySpeed)
            this.fetchSaleNumber()
        }
    }
</script>

<css>
</css>